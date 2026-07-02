# DEVELOPMENT OF TEMPORALLY-WEIGHTED AND COST-SENSITIVE RANDOM FOREST (TWCS-RF) MODEL

## 1. Statement of the Problem
This study aims to evaluate the effectiveness of the proposed Temporally-Weighted, Cost-Sensitive Random Forest (TWCS-RF) model. Specifically, it seeks to answer the following questions:
1. What is the classification performance of the developed TWCS-RF model in classifying the longitudinal directional trends of clinical chemistry and hematology data (increasing, decreasing, or stable), specifically when measured in terms of:
   1.1 Accuracy
   1.2 Balanced Accuracy
   1.3 Macro F1-Score
   1.4 Precision
   1.5 Recall
2. What is the computational efficiency of the TWCS-RF architecture, measured in total response time (inference latency in seconds)?
3. Is there a significant difference in the classification performance and computational efficiency between the proposed TWCS-RF algorithm and the unmodified standard Random Forest baseline?

## 2. Definition of Terms (Evaluation & Architecture)
* **Macro F1-Score:** A dependent classification metric computed as the unweighted arithmetic mean of the F1-scores calculated independently for each of the three directional trend classes. It is utilized to heavily penalize algorithms that achieve high overall accuracy simply by defaulting predictions to the majority class.
* **Balanced Accuracy:** The primary dependent variable used to measure classification performance under conditions of severe class imbalance. Operationally, it is computed as the arithmetic mean of the per-class recall scores across all three directional categories.
* **Temporal Decay Function:** A continuous mathematical formula that dynamically diminishes the predictive weight of older historical records while prioritizing recent clinical events, thereby calculating the patient's current biological momentum.
* **Cost-Sensitive Penalty (Inverse-Frequency Cost Matrix):** An algorithmically applied penalty that forces the decision trees to heavily weigh misclassification errors in the minority classes, preventing the model from developing a bias toward the majority "Stable" class.
* **Wilcoxon Signed-Rank Test:** A non-parametric statistical hypothesis test utilized to compare the paired, repeated performance metrics without assuming normal distribution.
* **Bonferroni Correction:** A strict statistical adjustment applied during hypothesis testing to counteract the multiple comparisons problem by lowering the alpha threshold.