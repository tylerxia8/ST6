package com.st6.integration.outlook;

import java.time.LocalDate;
import org.springframework.stereotype.Service;

@Service
public class NoopOutlookPlanningReminderService implements OutlookPlanningReminderService {
    @Override
    public void schedulePlanningReminder(String userId, LocalDate weekStart) {
        // Production implementation will call Microsoft Graph after tenant credentials are available.
    }

    @Override
    public void scheduleReconciliationReminder(String userId, LocalDate weekStart) {
        // Production implementation will call Microsoft Graph after tenant credentials are available.
    }
}
