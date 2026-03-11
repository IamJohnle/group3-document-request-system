<?php

namespace App\Http\Controllers;

use App\Models\DocumentType; // Siguraduhing may Model ka na nito
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentTypeController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/document-types', [
            'documentTypes' => DocumentType::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'requirements' => 'nullable|string',
        ]);

        DocumentType::create($validated);
        return back();
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'requirements' => 'nullable|string',
        ]);

        $doc = DocumentType::findOrFail($id);
        $doc->update($validated);
        return back();
    }

    public function destroy($id)
    {
        $doc = DocumentType::findOrFail($id);
        $doc->delete();
        return back();
    }
}