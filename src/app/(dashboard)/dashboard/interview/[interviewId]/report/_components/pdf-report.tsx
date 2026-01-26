"use client";

import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { format } from "date-fns";
import type { CategoryScores } from "@/server/routers/interview/interview.schemas";

// Standard fonts

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    backgroundColor: "#FFFFFF",
    color: "#0F172A",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 20,
    marginBottom: 30,
  },
  brandName: {
    fontSize: 24,
    fontWeight: 700,
    color: "#6D28D9", // Primary color
    marginBottom: 4,
  },
  brandSubtitle: {
    fontSize: 10,
    color: "#64748B",
  },
  meta: {
    alignItems: "flex-end",
  },
  metaTitle: {
    fontSize: 14,
    fontWeight: 700,
  },
  metaSubtitle: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 2,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#475569",
  },
  summaryCard: {
    backgroundColor: "#F8FAFC",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  summaryText: {
    fontSize: 11,
    lineHeight: 1.6,
    color: "#334155",
  },
  scoreGrid: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 20,
  },
  scoreCard: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  scoreLabel: {
    fontSize: 10,
    color: "#64748B",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: 700,
    color: "#6D28D9",
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryLabel: {
    width: 120,
    fontSize: 10,
    fontWeight: 700,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
    marginRight: 10,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#6D28D9",
    borderRadius: 3,
  },
  categoryScore: {
    width: 30,
    fontSize: 10,
    fontWeight: 700,
    textAlign: "right",
  },
  feedbackSection: {
    marginTop: 10,
  },
  feedbackItem: {
    flexDirection: "row",
    marginBottom: 6,
    gap: 8,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 5,
  },
  bulletStrength: { backgroundColor: "#10B981" },
  bulletWeakness: { backgroundColor: "#F97316" },
  bulletSuggestion: { backgroundColor: "#6D28D9" },
  feedbackText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.5,
    color: "#334155",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 15,
  },
  footerText: {
    fontSize: 8,
    color: "#94A3B8",
  },
});

interface InterviewReportPDFProps {
  report: {
    summary: string;
    overallScore: number;
    categoryScores: CategoryScores;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
  };
  jobTitle: string;
  interviewDate: Date;
}

export function InterviewReportPDF({
  report,
  jobTitle,
  interviewDate,
}: InterviewReportPDFProps) {
  const categories = [
    { label: "Communication", value: report.categoryScores.communication },
    { label: "Problem Solving", value: report.categoryScores.problemSolving },
    { label: "Technical", value: report.categoryScores.technicalKnowledge },
    { label: "Code Quality", value: report.categoryScores.codeQuality },
    { label: "Time Management", value: report.categoryScores.timeManagement },
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>Interview AI</Text>
            <Text style={styles.brandSubtitle}>
              Comprehensive Performance Report
            </Text>
          </View>
          <View style={styles.meta}>
            <Text style={styles.metaTitle}>{jobTitle}</Text>
            <Text style={styles.metaSubtitle}>
              {format(new Date(interviewDate), "MMMM d, yyyy")}
            </Text>
          </View>
        </View>

        {/* Executive Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryText}>{report.summary}</Text>
          </View>
        </View>

        {/* Performance Evaluation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Evaluation</Text>

          {/* Overall Score */}
          <View style={styles.scoreGrid}>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>Overall Score</Text>
              <Text style={styles.scoreValue}>{report.overallScore}/100</Text>
            </View>
          </View>

          {/* Category Breakdown */}
          <View style={styles.summaryCard}>
            {categories.map((cat, index) => (
              <View key={cat.label} style={styles.categoryRow}>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
                <View style={styles.progressBarBg}>
                  <View
                    style={[styles.progressBarFill, { width: `${cat.value}%` }]}
                  />
                </View>
                <Text style={styles.categoryScore}>{cat.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Detailed Feedback */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detailed Analysis</Text>

          <View style={{ gap: 15 }}>
            {/* Strengths */}
            <View>
              <Text
                style={{
                  ...styles.scoreLabel,
                  color: "#10B981",
                  marginBottom: 8,
                }}
              >
                Key Strengths
              </Text>
              {report.strengths.map((item, i) => (
                <View key={i} style={styles.feedbackItem}>
                  <View style={[styles.bullet, styles.bulletStrength]} />
                  <Text style={styles.feedbackText}>{item}</Text>
                </View>
              ))}
            </View>

            {/* Areas for Improvement */}
            <View>
              <Text
                style={{
                  ...styles.scoreLabel,
                  color: "#F97316",
                  marginBottom: 8,
                }}
              >
                Areas for Improvement
              </Text>
              {report.weaknesses.map((item, i) => (
                <View key={i} style={styles.feedbackItem}>
                  <View style={[styles.bullet, styles.bulletWeakness]} />
                  <Text style={styles.feedbackText}>{item}</Text>
                </View>
              ))}
            </View>

            {/* Recommendations */}
            <View>
              <Text
                style={{
                  ...styles.scoreLabel,
                  color: "#6D28D9",
                  marginBottom: 8,
                }}
              >
                Recommendations
              </Text>
              {report.suggestions.map((item, i) => (
                <View key={i} style={styles.feedbackItem}>
                  <View style={[styles.bullet, styles.bulletSuggestion]} />
                  <Text style={styles.feedbackText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Generated by Interview AI</Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
            fixed
          />
        </View>
      </Page>
    </Document>
  );
}
