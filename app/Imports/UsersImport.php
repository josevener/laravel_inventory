<?php

namespace App\Imports;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Spatie\Permission\Models\Role;

class UsersImport implements ToModel, WithHeadingRow, WithValidation, SkipsEmptyRows
{
    public int $imported = 0;
    public int $updated = 0;
    public int $skipped = 0;

    public array $importedRows = [];
    public array $updatedRows = [];
    public array $skippedRows = [];

    // Track emails already processed in this import file
    private array $seenEmails = [];

    public function headingRow(): int
    {
        return 1;
    }

    public function prepareForValidation($data, $index)
    {
        return [
            'first_name' => $data['firstname'] ?? $data['first_name'] ?? null,
            'last_name' => $data['lastname'] ?? $data['last_name'] ?? null,
            'email_address' => $data['emailaddress'] ?? $data['email_address'] ?? null,
            'roles' => $data['roles'] ?? null,
        ];
    }

    // Skip completely blank rows only
    public function isEmptyWhen(array $row): bool
    {
        $firstName = false; //trim($row['first_name'] ?? '');
        $lastName  = false; //trim($row['last_name'] ?? '');
        $email     = false; //trim($row['email_address'] ?? '');

        return $firstName === '' && $lastName === '' && $email === '';
    }

    public function model(array $row)
    {
        $email = strtolower(trim($row['email_address'] ?? ''));
        $firstName = trim($row['first_name'] ?? '');
        $lastName = trim($row['last_name'] ?? '');
        $fullName = trim($firstName . ' ' . $lastName);

        // Skip if missing required fields
        $missing = [];
        if ($firstName === '') $missing[] = 'FirstName';
        if ($lastName === '') $missing[] = 'LastName';
        if ($email === '') $missing[] = 'EmailAddress';

        if (!empty($missing)) {
            $this->skipped++;
            $this->skippedRows[] = [
                'name' => $fullName !== '' ? $fullName : '—',
                'email' => $email !== '' ? $email : '—',
                'reason' => 'Missing: ' . implode(', ', $missing),
            ];
            return null;
        }

        // Skip duplicate emails inside the same Excel file
        if (in_array($email, $this->seenEmails, true)) {
            $this->skipped++;
            $this->skippedRows[] = [
                'name' => $fullName !== '' ? $fullName : '—',
                'email' => $email,
                'reason' => 'Duplicate email in import file (skipped)',
            ];
            return null;
        }

        // mark as processed
        $this->seenEmails[] = $email;

        $existingUser = User::where('email', $email)->first();

        $passwordToSave = $existingUser
            ? $existingUser->password
            : Hash::make('12345678');

        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'client_id' => Auth::user()->client_id,
                'first_name' => $firstName,
                'last_name' => $lastName,
                'password' => $passwordToSave,
                'is_active' => true,
            ]
        );

        if ($user->wasRecentlyCreated) {
            $this->imported++;
            $this->importedRows[] = [
                'name' => $fullName,
                'email' => $email,
            ];
        } 
        else {
            $this->updated++;
            $this->updatedRows[] = [
                'name' => $fullName,
                'email' => $email,
            ];
        }

        // roles nullable
        $rolesRaw = trim($row['roles'] ?? '');
        $roles = array_filter(array_map('trim', explode(',', $rolesRaw)));

        if (!empty($roles)) {
            foreach ($roles as $roleName) {
                Role::firstOrCreate([
                    'name' => $roleName,
                    'guard_name' => 'web',
                ]);
            }

            $user->syncRoles($roles);
        }

        return $user;
    }

    // skipping rows if not provided
    public function rules(): array
    {
        return [
            '*.first_name' => ['nullable', 'string'],
            '*.last_name' => ['nullable', 'string'],
            '*.email_address' => ['nullable', 'string'],
            '*.roles' => ['nullable', 'string'],
        ];
    }
}