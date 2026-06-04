export const buildReportPayload = ({
  monitoringBaseInfo,
  beforeExecutionTable,
  durringExecutionTable,
  caseExecutionTable,
  afterExecutionTable,
}) => {
  return {
    reportHeader: monitoringBaseInfo,

    tables: {
      sources: monitoringBaseInfo?.sources ?? [],

      beforeExecution: beforeExecutionTable?.rows ?? [],
      durringExecution: durringExecutionTable?.rows ?? [],
      caseExecution: caseExecutionTable?.rows ?? [],

      // اسم‌گذاری‌ها هم بهتر است دقیق باشد:
      afterExecution: afterExecutionTable?.rows ?? [],
    },

    // اگر بک‌اند به title/columns/total هم نیاز دارد، جدا بفرست:
    tableMeta: {
      beforeExecution: {
        id: beforeExecutionTable?.id,
        title: beforeExecutionTable?.title,
        columns: beforeExecutionTable?.columns,
        total: beforeExecutionTable?.total,
        currency: beforeExecutionTable?.currency,
      },
      durringExecution: {
        id: durringExecutionTable?.id,
        title: durringExecutionTable?.title,
        columns: durringExecutionTable?.columns,
        total: durringExecutionTable?.total,
        currency: durringExecutionTable?.currency,
      },
      caseExecution: {
        id: caseExecutionTable?.id,
        title: caseExecutionTable?.title,
        columns: caseExecutionTable?.columns,
        total: caseExecutionTable?.total,
        currency: caseExecutionTable?.currency,
      },
      afterExecution: {
        id: afterExecutionTable?.id,
        title: afterExecutionTable?.title,
        columns: afterExecutionTable?.columns,
        total: afterExecutionTable?.total,
        currency: afterExecutionTable?.currency,
      },
    },
  };
};
