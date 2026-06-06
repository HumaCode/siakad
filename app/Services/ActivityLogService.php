<?php

namespace App\Services;

use Spatie\Activitylog\Models\Activity;
use Illuminate\Pagination\LengthAwarePaginator;

class ActivityLogService
{
    /**
     * Get paginated activity logs with filters and stats.
     */
    public function getPaginatedLogs(
        ?string $search,
        ?string $logName,
        ?string $event,
        ?string $causerType,
        ?string $dateFrom,
        ?string $dateTo,
        int $perPage = 20
    ): array {
        $query = Activity::with(['causer'])
            ->orderBy('created_at', 'desc');

        // Search by description or subject type
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('log_name', 'like', "%{$search}%")
                  ->orWhere('subject_type', 'like', "%{$search}%");
            });
        }

        // Filter by log_name (module)
        if ($logName) {
            $query->where('log_name', $logName);
        }

        // Filter by event type
        if ($event) {
            $query->where('event', $event);
        }

        // Filter by causer type
        if ($causerType) {
            $query->where('causer_type', $causerType);
        }

        // Filter by date range
        if ($dateFrom) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }
        if ($dateTo) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        $logs = $query->paginate($perPage)->withQueryString();

        // Stats
        $totalLogs     = Activity::count();
        $todayLogs     = Activity::whereDate('created_at', today())->count();
        $createEvents  = Activity::where('event', 'created')->count();
        $updateEvents  = Activity::where('event', 'updated')->count();
        $deleteEvents  = Activity::where('event', 'deleted')->count();

        // Available filter options
        $logNames = Activity::distinct()->pluck('log_name')->filter()->values();
        $events   = Activity::distinct()->pluck('event')->filter()->values();

        return [
            'logs'     => $logs,
            'stats'    => [
                'total'   => $totalLogs,
                'today'   => $todayLogs,
                'created' => $createEvents,
                'updated' => $updateEvents,
                'deleted' => $deleteEvents,
            ],
            'logNames' => $logNames,
            'events'   => $events,
        ];
    }

    /**
     * Delete a single activity log entry.
     */
    public function deleteLog(Activity $activity): bool
    {
        return (bool) $activity->delete();
    }

    /**
     * Clear all activity logs (truncate).
     */
    public function clearAllLogs(): int
    {
        return Activity::query()->delete();
    }

    /**
     * Clear logs older than given days.
     */
    public function clearOldLogs(int $days = 30): int
    {
        return Activity::where('created_at', '<', now()->subDays($days))->delete();
    }
}
