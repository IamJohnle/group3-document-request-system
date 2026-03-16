import { Head, useForm, usePage } from '@inertiajs/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppSidebarLayout from '../../layouts/app/app-sidebar-layout';

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  contact_number?: string;
  birth_date?: string;
  gender?: string;
  religion?: string;
  street?: string;
  barangay?: string;
  municipality?: string;
  province?: string;
  student_id: string;
  course?: string;
  year_level?: string;
  section?: string;
  enrollment_date?: string;
}

interface InformationProps {
  student: Student;
}

const Information = ({ student }: InformationProps) => {
  const { flash } = usePage().props as any;

  type FormData = {
    first_name: string;
    last_name: string;
    middle_name: string;
    contact_number: string;
    birth_date: string;
    gender: string;
    religion: string;
    street: string;
    barangay: string;
    municipality: string;
    province: string;
    course: string;
    year_level: string;
    section: string;
  };

  const initialData: FormData = {
    // Personal Information
    first_name: student.first_name || '',
    last_name: student.last_name || '',
    middle_name: student.middle_name || '',
    contact_number: student.contact_number || '',
    birth_date: student.birth_date || '',
    gender: student.gender || '',
    religion: student.religion || '',

    // Address Information
    street: student.street || '',
    barangay: student.barangay || '',
    municipality: student.municipality || '',
    province: student.province || '',

    // Academic Information
    course: student.course || '',
    year_level: student.year_level || '',
    section: student.section || '',
  };

  const { data, setData, put, processing } = useForm<FormData>(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if data has changed
    const hasChanged = (Object.keys(initialData) as Array<keyof FormData>).some(
      (key) => data[key] !== initialData[key],
    );

    if (!hasChanged) {
      alert('Data already saved');
      return;
    }

    put('/student/information', {
      onSuccess: () => {
        alert('Information updated successfully!');
      }
    });
  };

  return (
    <AppSidebarLayout>
      <Head title="Student Information" />

      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Student Information</h1>
          <p className="text-gray-600">Update your personal and academic information</p>
          { flash?.message && (
            <p className="text-green-600 mt-2">{flash.message}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <p className="text-gray-600 mb-6">Your basic personal details</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={data.first_name}
                  onChange={(e) => setData('first_name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="middle_name">Middle Name</Label>
                <Input
                  id="middle_name"
                  value={data.middle_name}
                  onChange={(e) => setData('middle_name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={data.last_name}
                  onChange={(e) => setData('last_name', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="contact_number">Contact Number</Label>
                <Input
                  id="contact_number"
                  value={data.contact_number}
                  onChange={(e) => setData('contact_number', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="birth_date">Birth Date</Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={data.birth_date}
                  onChange={(e) => setData('birth_date', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select value={data.gender} onValueChange={(value) => setData('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="religion">Religion</Label>
                <Input
                  id="religion"
                  value={data.religion}
                  onChange={(e) => setData('religion', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Address Information</h2>
            <p className="text-gray-600 mb-6">Your current residential address</p>

            <div className="mb-4">
              <Label htmlFor="street">Street</Label>
              <Input
                id="street"
                value={data.street}
                onChange={(e) => setData('street', e.target.value)}
                placeholder="Street address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="barangay">Barangay</Label>
                <Input
                  id="barangay"
                  value={data.barangay}
                  onChange={(e) => setData('barangay', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="municipality">Municipality/City</Label>
                <Input
                  id="municipality"
                  value={data.municipality}
                  onChange={(e) => setData('municipality', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="province">Province</Label>
                <Input
                  id="province"
                  value={data.province}
                  onChange={(e) => setData('province', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Academic Information</h2>
            <p className="text-gray-600 mb-6">Your current academic details</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="student_id">Student ID</Label>
                <Input
                  id="student_id"
                  value={student.student_id}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">Student ID cannot be changed</p>
              </div>
              <div>
                <Label htmlFor="course">Course/Program</Label>
                <Input
                  id="course"
                  value={data.course}
                  onChange={(e) => setData('course', e.target.value)}
                  placeholder="e.g., Bachelor of Science in Computer Science"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year_level">Year Level</Label>
                <Select value={data.year_level} onValueChange={(value) => setData('year_level', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st Year">1st Year</SelectItem>
                    <SelectItem value="2nd Year">2nd Year</SelectItem>
                    <SelectItem value="3rd Year">3rd Year</SelectItem>
                    <SelectItem value="4th Year">4th Year</SelectItem>
                    <SelectItem value="5th Year">5th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="section">Section</Label>
                <Input
                  id="section"
                  value={data.section}
                  onChange={(e) => setData('section', e.target.value)}
                  placeholder="e.g., A, B, C"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={processing}>
              {processing ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </AppSidebarLayout>
  );
};

export default Information;
