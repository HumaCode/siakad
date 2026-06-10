<?php

namespace App\Support;

use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\MediaLibrary\Support\PathGenerator\PathGenerator;

class CustomPathGenerator implements PathGenerator
{
    /**
     * Get the path for the given media, relative to the root storage path.
     */
    public function getPath(Media $media): string
    {
        return $this->getBasePath($media) . '/';
    }

    /**
     * Get the path for conversions of the given media, relative to the root storage path.
     */
    public function getPathForConversions(Media $media): string
    {
        return $this->getBasePath($media) . '/conversions/';
    }

    /**
     * Get the path for responsive images of the given media, relative to the root storage path.
     */
    public function getPathForResponsiveImages(Media $media): string
    {
        return $this->getBasePath($media) . '/responsive-images/';
    }

    /**
     * Determine the base path based on model type and collection name.
     */
    protected function getBasePath(Media $media): string
    {
        $folder = 'general';
        
        if ($media->model_type === 'App\\Models\\Mahasiswa') {
            $folder = 'mahasiswa/' . ($media->collection_name ?: 'misc');
        } elseif ($media->model_type === 'App\\Models\\Dosen') {
            $folder = 'dosen/' . ($media->collection_name ?: 'misc');
        }
        
        return $folder . '/' . $media->id;
    }
}
