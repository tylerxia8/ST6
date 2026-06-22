package com.st6.integration.outlook;

import java.time.LocalDate;

public interface OutlookPlanningReminderService {
    void schedulePlanningReminder(String userId, LocalDate weekStart);

    void scheduleReconciliationReminder(String userId, LocalDate weekStart);
}
