<?php

namespace Database\Seeders;

use App\Models\DocumentRequest;
use App\Models\DocumentType;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'), // Password: password
            'role' => 'admin',
        ]);

        // Create student user
        $student = User::factory()->create([
            'name' => 'Test Student',
            'email' => 'student@example.com',
            'password' => bcrypt('password'), // Password: password
            'role' => 'student',
        ]);

        // Create document types
        $certificateType = DocumentType::create([
            'name' => 'Certificate of Enrollment',
            'description' => 'Official certificate showing student enrollment',
        ]);

        $transcriptType = DocumentType::create([
            'name' => 'Academic Transcript',
            'description' => 'Complete academic record and grades',
        ]);

        $diplomaType = DocumentType::create([
            'name' => 'Diploma',
            'description' => 'Graduation diploma document',
        ]);

        // Create sample document requests
        DocumentRequest::create([
            'user_id' => $student->id,
            'document_type_id' => $certificateType->id,
            'purpose' => 'For loan application',
            'copies' => 2,
            'status' => 'Pending',
        ]);

        DocumentRequest::create([
            'user_id' => $student->id,
            'document_type_id' => $transcriptType->id,
            'purpose' => 'For scholarship application',
            'copies' => 1,
            'status' => 'Completed',
        ]);

        DocumentRequest::create([
            'user_id' => $student->id,
            'document_type_id' => $diplomaType->id,
            'purpose' => 'Official records',
            'copies' => 3,
            'status' => 'Pending',
        ]);
    }
}
