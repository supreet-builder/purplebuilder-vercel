// Simulation state machine
export const SimulationState = {
  IDLE: "idle",
  RUNNING: "running",
  PAUSED: "paused",
  STOPPED: "stopped",
  ERROR: "error"
};

export const StepState = {
  MOVING: "moving",
  READING: "reading",
  REQUESTING: "requesting_feedback",
  PRESENTING: "presenting_feedback"
};

// Generate sections for PDF or website
export function generateSections(previewMode, previewElement, containerRef = null) {
  const sections = [];

  // Get container - prefer the containerRef if provided
  let container = containerRef?.current || null;
  
  // Fallback: try to find container from previewElement
  if (!container && previewElement) {
    container = previewElement.parentElement;
    // If parentElement doesn't have the right dimensions, try going up more
    if (container && container.getBoundingClientRect && container.getBoundingClientRect().height < 100) {
      container = container.parentElement;
    }
  }
  
  // Last resort: try to find container by querying
  if (!container || !container.getBoundingClientRect) {
    container = previewElement?.closest('[style*="position: relative"]') ||
                previewElement?.closest('div[style*="background"]');
  }

  if (!container) {
    console.warn("Could not find container for sections");
    return sections;
  }

  const rect = container.getBoundingClientRect();
  
  if (previewMode === "deck") {
    // For PDF: create one section per slide (page)
    // Estimate pages based on scrollHeight (PDFs are typically ~800-1000px per page)
    const scrollHeight = container.scrollHeight || rect.height;
    const viewportHeight = rect.height;
    const pageHeight = 900; // Average PDF page height
    const estimatedPages = Math.max(1, Math.ceil(scrollHeight / pageHeight));
    
    // Create one section per slide, positioned at the center of each slide
    for (let page = 0; page < estimatedPages; page++) {
      const slideCenterY = (page * pageHeight) + (pageHeight / 2);
      sections.push({
        id: `slide-${page + 1}`,
        pageIndex: page,
        label: `Slide ${page + 1}`,
        bbox: {
          x: rect.width / 2,
          y: slideCenterY,
          width: rect.width * 0.9,
          height: pageHeight * 0.8
        },
        textSnippet: `Reviewing slide ${page + 1} of the pitch deck`,
        slideNumber: page + 1
      });
    }
  } else if (previewMode === "website") {
    // For website: use iframe content or create sections based on scroll positions
    const scrollHeight = container.scrollHeight || rect.height;
    // Create sections at different scroll positions
    const scrollPositions = [0, 0.25, 0.5, 0.75, 1.0];
    
    scrollPositions.forEach((scrollRatio, idx) => {
      sections.push({
        id: `website-${idx}`,
        pageIndex: 0,
        label: `Section ${idx + 1}`,
        bbox: {
          x: rect.width / 2,
          y: scrollHeight * scrollRatio,
          width: rect.width * 0.8,
          height: 200
        },
        textSnippet: `Content from website section ${idx + 1}`,
        scrollRatio
      });
    });
  }

  return sections;
}

// Simulation loop controller
export class SimulationController {
  constructor({
    onStateChange,
    onStepChange,
    onFeedback,
    onPositionChange,
    onStatusChange
  }) {
    this.onStateChange = onStateChange;
    this.onStepChange = onStepChange;
    this.onFeedback = onFeedback;
    this.onPositionChange = onPositionChange;
    this.onStatusChange = onStatusChange;
    
    this.state = SimulationState.IDLE;
    this.stepState = null;
    this.abortController = null;
    this.currentSectionIndex = 0;
    this.sections = [];
    this.startTime = null;
    this.elapsedSeconds = 0;
    this.timerInterval = null;
    this.isPaused = false;
  }

  start(sections, persona, previewElement, previewMode) {
    if (this.state === SimulationState.RUNNING) return;
    
    this.sections = sections;
    this.persona = persona;
    this.previewElement = previewElement;
    this.previewMode = previewMode;
    this.currentSectionIndex = 0;
    this.startTime = Date.now();
    this.elapsedSeconds = 0;
    this.isPaused = false;
    this.abortController = new AbortController();
    
    this.setState(SimulationState.RUNNING);
    this.startTimer();
    this.processNextSection();
  }

  pause() {
    if (this.state !== SimulationState.RUNNING) return;
    this.isPaused = true;
    this.setState(SimulationState.PAUSED);
    this.onStatusChange("Paused");
  }

  resume() {
    if (this.state !== SimulationState.PAUSED) return;
    this.isPaused = false;
    this.setState(SimulationState.RUNNING);
    this.processNextSection();
  }

  stop() {
    this.setState(SimulationState.STOPPED);
    if (this.abortController) {
      this.abortController.abort();
    }
    this.stopTimer();
    this.onStatusChange("Stopped");
  }

  setState(newState) {
    this.state = newState;
    this.onStateChange(newState);
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (!this.isPaused && this.startTime) {
        this.elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  async processNextSection() {
    if (this.state !== SimulationState.RUNNING || this.isPaused) return;
    if (this.currentSectionIndex >= this.sections.length) {
      this.stop();
      return;
    }

    const section = this.sections[this.currentSectionIndex];
    
    // Move cursor
    this.setStepState(StepState.MOVING);
    const slideNum = section.slideNumber || section.label.match(/\d+/)?.[0] || "";
    this.onStatusChange(slideNum ? `Reviewing slide ${slideNum}...` : "Moving to slide...");
    this.moveCursorToSection(section);
    
    // Wait for scroll animation to complete
    await this.delay(1200);

    if (this.abortController?.signal.aborted) return;

    // Reading - simulate investor looking at the slide
    this.setStepState(StepState.READING);
    this.onStatusChange(slideNum ? `Examining slide ${slideNum}...` : "Reading slide...");
    await this.delay(1500); // Give time to actually "read" the slide

    if (this.abortController?.signal.aborted) return;

    // Request feedback
    this.setStepState(StepState.REQUESTING);
    this.onStatusChange(slideNum ? `Formulating thoughts on slide ${slideNum}...` : "Thinking...");
    
    try {
      const feedback = await this.requestFeedback(section);
      
      if (this.abortController?.signal.aborted) return;

      // Present feedback
      this.setStepState(StepState.PRESENTING);
      const timestamp = Math.floor((Date.now() - this.startTime) / 1000);
      
      this.onFeedback({
        section: section.label,
        feedback: feedback,
        timestamp: timestamp,
        slideNumber: slideNum
      });

      // Give time to read the feedback
      await this.delay(2000);
    } catch (error) {
      console.error("Feedback error:", error);
      if (!this.abortController?.signal.aborted) {
        this.onFeedback({
          section: section.label,
          feedback: "Unable to generate feedback for this section.",
          timestamp: Math.floor((Date.now() - this.startTime) / 1000)
        });
      }
    }

    if (this.abortController?.signal.aborted) return;

    // Move to next section
    this.currentSectionIndex++;
    this.processNextSection();
  }

  moveCursorToSection(section) {
    // Try multiple ways to get the container
    let container = this.previewElement?.parentElement;
    if (!container || !container.getBoundingClientRect) {
      container = this.previewElement?.closest('[style*="position: relative"]') ||
                  document.querySelector('[ref="previewContainerRef"]')?.current;
    }
    
    if (!container) {
      console.warn("Container not found for cursor movement");
      // Use fallback position
      this.onPositionChange({ x: 400, y: 300 });
      return;
    }

    const rect = container.getBoundingClientRect();
    const containerCenterX = rect.left + (rect.width / 2);
    
    // Calculate cursor position - center of viewport horizontally, section Y position
    let targetY = section.bbox?.y || rect.height / 2;
    
    // For PDF: scroll first, then position cursor in viewport center
    if (this.previewMode === "deck") {
      // Scroll PDF so the section is visible in the center of viewport
      const viewportCenter = container.clientHeight / 2;
      const targetScrollY = targetY - viewportCenter;
      
      // Scroll the container smoothly
      if (container.scrollTo) {
        container.scrollTo({
          top: Math.max(0, targetScrollY),
          behavior: "smooth"
        });
      } else if (container.scrollTop !== undefined) {
        container.scrollTop = Math.max(0, targetScrollY);
      }
      
      // Position cursor at viewport center (so it stays visible as PDF scrolls)
      const cursorY = rect.top + viewportCenter;
      this.onPositionChange({ x: containerCenterX, y: cursorY });
    } else if (this.previewMode === "website" && section.scrollRatio !== undefined) {
      // For website, scroll iframe
      const iframe = this.previewElement;
      if (iframe?.contentWindow) {
        try {
          const scrollHeight = iframe.contentDocument?.documentElement?.scrollHeight || 0;
          const targetScroll = scrollHeight * section.scrollRatio;
          iframe.contentWindow.scrollTo({
            top: targetScroll,
            behavior: "smooth"
          });
        } catch (e) {
          // Cross-origin, can't scroll
        }
      }
      // Position cursor at section location
      const cursorY = rect.top + (rect.height * section.scrollRatio);
      this.onPositionChange({ x: containerCenterX, y: cursorY });
    } else {
      // Fallback
      this.onPositionChange({ x: containerCenterX, y: rect.top + (section.bbox?.y || rect.height / 2) });
    }
  }

  async requestFeedback(section) {
    const response = await fetch("/api/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        persona: this.persona,
        section: {
          label: section.label,
          textSnippet: section.textSnippet,
          pageIndex: section.pageIndex
        },
        previewMode: this.previewMode
      }),
      signal: this.abortController?.signal
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.feedback || data.feedbackBullets?.join("\n") || "No feedback available.";
  }

  setStepState(stepState) {
    this.stepState = stepState;
    this.onStepChange(stepState);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getElapsedSeconds() {
    return this.elapsedSeconds;
  }
}
