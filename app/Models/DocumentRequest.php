<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentRequest extends Model {
    protected $fillable = [
        'user_id',
        'document_type_id', // Updated this
        'purpose',
        'copies',
        'attachment',
        'status',
        'admin_notes',
        'final_file'
    ];

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }

    // New Relationship
    public function documentType(): BelongsTo {
        return $this->belongsTo(DocumentType::class);
    }
}
