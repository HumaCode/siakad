<?php

namespace App\Http\Controllers\Sistem;

use App\Http\Controllers\Controller;
use App\Services\ActivityLogService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    protected ActivityLogService $service;

    public function __construct(ActivityLogService $service)
    {
        $this->service = $service;
    }

    /**
     * Display activity log listing.
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'log_name', 'event', 'causer_type', 'date_from', 'date_to']);

        $data = $this->service->getPaginatedLogs(
            search:      $filters['search']      ?? null,
            logName:     $filters['log_name']    ?? null,
            event:       $filters['event']       ?? null,
            causerType:  $filters['causer_type'] ?? null,
            dateFrom:    $filters['date_from']   ?? null,
            dateTo:      $filters['date_to']     ?? null,
            perPage:     20
        );

        // Transform logs for frontend
        $logs = $data['logs']->through(function (Activity $activity) {
            $causer = $activity->causer;

            return [
                'id'           => $activity->id,
                'log_name'     => $activity->log_name,
                'description'  => $activity->description,
                'event'        => $activity->event,
                'subject_type' => $activity->subject_type
                    ? class_basename($activity->subject_type)
                    : null,
                'subject_id'   => $activity->subject_id,
                'causer_id'    => $activity->causer_id,
                'causer_name'  => $causer?->name ?? 'System',
                'causer_email' => $causer?->email ?? null,
                'properties'   => $activity->properties?->toArray() ?? [],
                'changes'      => $activity->changes?->toArray() ?? [],
                'created_at'   => $activity->created_at?->format('Y-m-d H:i:s'),
                'created_at_human' => $activity->created_at?->diffForHumans(),
            ];
        });

        return Inertia::render('Sistem/ActivityLog', [
            'logs'     => $logs,
            'stats'    => $data['stats'],
            'logNames' => $data['logNames'],
            'events'   => $data['events'],
            'filters'  => $filters,
        ]);
    }

    /**
     * Delete a single log entry.
     */
    public function destroy(Activity $activity): RedirectResponse
    {
        $this->service->deleteLog($activity);

        return back()->with('success', 'Log berhasil dihapus');
    }

    /**
     * Clear all logs.
     */
    public function clearAll(): RedirectResponse
    {
        $count = $this->service->clearAllLogs();

        return back()->with('success', "{$count} log berhasil dibersihkan");
    }

    /**
     * Clear logs older than 30 days.
     */
    public function clearOld(): RedirectResponse
    {
        $count = $this->service->clearOldLogs(30);

        return back()->with('success', "{$count} log lama (>30 hari) berhasil dibersihkan");
    }
}
