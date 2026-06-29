import { defineStore } from "pinia";
import { getCurrentJob, getNextJob, jobSwipeCards } from "../data/jobSwipeModel.js";

const STORAGE_KEY = "lipyum.partner.jobSwipe.v1";

function readSavedState() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export const useJobSwipeStore = defineStore("jobSwipe", {
  state: () => ({
    jobs: jobSwipeCards,
    currentIndex: 0,
    dismissedIds: [],
    lastAction: null,
    callScheduleJobId: "",
    ...readSavedState(),
  }),
  getters: {
    currentJob(state) {
      return getCurrentJob(state.currentIndex, state.jobs);
    },
    nextJob(state) {
      return getNextJob(state.currentIndex, state.jobs);
    },
    hasJobs(state) {
      return Boolean(getCurrentJob(state.currentIndex, state.jobs));
    },
    remainingCount(state) {
      return Math.max(0, state.jobs.length - state.currentIndex);
    },
  },
  actions: {
    persist() {
      if (typeof window === "undefined") return;
      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            currentIndex: this.currentIndex,
            dismissedIds: this.dismissedIds,
            lastAction: this.lastAction,
            callScheduleJobId: this.callScheduleJobId,
          }),
        );
      } catch {
        // localStorage can be unavailable in private or restricted contexts.
      }
    },
    advanceJob(reason = "swipe-left") {
      const job = this.currentJob;
      if (job) this.dismissedIds.push(job.id);
      this.currentIndex += 1;
      this.lastAction = reason;
      this.persist();
    },
    openCallSchedule(jobId = this.currentJob?.id) {
      this.callScheduleJobId = jobId || "";
      this.lastAction = "call-schedule";
      this.persist();
    },
    resetDeck() {
      this.currentIndex = 0;
      this.dismissedIds = [];
      this.lastAction = "reset";
      this.callScheduleJobId = "";
      this.persist();
    },
  },
});
