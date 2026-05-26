import type { CdekDeliveryStage } from "@/types";

import styles from "../page.module.css";

interface CdekDeliveryStepsProps {
  stages?: CdekDeliveryStage[];
}

export function CdekDeliverySteps({ stages }: CdekDeliveryStepsProps) {
  if (!stages?.length) return null;

  return (
    <ol className={styles.deliverySteps}>
      {stages.map((stage) => (
        <li
          key={stage.key}
          className={`${styles.deliveryStep} ${styles[`deliveryStep_${stage.status}`] ?? ""}`}
        >
          <div className={styles.deliveryStepTitle}>{stage.title}</div>
          <p className={styles.deliveryStepDesc}>{stage.description}</p>
        </li>
      ))}
    </ol>
  );
}
