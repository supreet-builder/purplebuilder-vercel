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
    onStatusChange,
    onSpeak,
    containerRef
  }) {
    this.onStateChange = onStateChange;
    this.onStepChange = onStepChange;
    this.onFeedback = onFeedback;
    this.onPositionChange = onPositionChange;
    this.onStatusChange = onStatusChange;
    this.onSpeak = onSpeak || (() => {}); // Optional voice feedback
    this.containerRef = containerRef; // Store container ref for scrolling
    
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
    
    // Scroll to top of PDF at start
    if (previewMode === "deck") {
      let container = previewElement?.parentElement;
      if (!container || !container.getBoundingClientRect) {
        container = previewElement?.closest('[style*="position: relative"]');
      }
      if (container && container.scrollTo) {
        container.scrollTo({ top: 0, behavior: "smooth" });
      } else if (container && container.scrollTop !== undefined) {
        container.scrollTop = 0;
      }
    }
    
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

    // Generate 1-2 sequential feedback sentences for this slide
    const numFeedbackSentences = 1 + Math.floor(Math.random() * 2); // 1-2 sentences
    
    for (let i = 0; i < numFeedbackSentences; i++) {
      if (this.abortController?.signal.aborted) return;
      
      // Request feedback (one sentence at a time)
      this.setStepState(StepState.REQUESTING);
      this.onStatusChange(slideNum ? `Formulating thoughts on slide ${slideNum}...` : "Thinking...");
      
      try {
        const feedback = await this.requestFeedback(section);
        
        if (this.abortController?.signal.aborted) return;

        // Present feedback as a single bubble
        this.setStepState(StepState.PRESENTING);
        const timestamp = Math.floor((Date.now() - this.startTime) / 1000);
        
        this.onFeedback({
          section: section.label,
          feedback: feedback,
          timestamp: timestamp,
          slideNumber: slideNum,
          id: `${section.id}-${i}` // Unique ID for each bubble
        });

        // Speak the feedback using persona's voice
        if (this.onSpeak && feedback) {
          this.onSpeak(feedback);
          // Wait for speech to complete (estimate: ~3-5 seconds per sentence)
          await this.delay(Math.max(3000, feedback.length * 50));
        } else {
          // If no voice, still give time to read
          await this.delay(2500);
        }

        // Small pause between sentences (like real investor thinking)
        if (i < numFeedbackSentences - 1) {
          await this.delay(800);
        }
      } catch (error) {
        console.error("Feedback error:", error);
        // Don't stop simulation on error - continue to next feedback or next slide
        if (!this.abortController?.signal.aborted && i === 0) {
          // Only show error on first attempt
          this.onFeedback({
            section: section.label,
            feedback: "Unable to generate feedback for this section.",
            timestamp: Math.floor((Date.now() - this.startTime) / 1000),
            slideNumber: slideNum,
            id: `${section.id}-error`
          });
        }
        // Continue even if there's an error
        await this.delay(1000);
      }
    }

    if (this.abortController?.signal.aborted) {
      console.log("Simulation aborted");
      return;
    }

    // Move to next section - ensure this always happens
    this.currentSectionIndex++;
    
    // Add small delay before next section to prevent rapid fire
    await this.delay(500);
    
    // Continue to next section - wrap in try-catch to prevent random stops
    try {
      this.processNextSection();
    } catch (error) {
      console.error("Error processing next section:", error);
      // Try to continue anyway
      if (this.currentSectionIndex < this.sections.length) {
        setTimeout(() => this.processNextSection(), 1000);
      } else {
        this.stop();
      }
    }
  }

  moveCursorToSection(section) {
    // Try multiple ways to get the container - prioritize previewContainerRef
    let container = null;
    
    // First try to get container from the containerRef if available
    if (this.containerRef?.current) {
      container = this.containerRef.current;
    }
    
    // Fallback: try parent element
    if (!container) {
      container = this.previewElement?.parentElement;
    }
    
    // Fallback: try closest scrollable parent
    if (!container || !container.getBoundingClientRect) {
      container = this.previewElement?.closest('[style*="overflow"]') ||
                  this.previewElement?.closest('[style*="position: relative"]');
    }
    
    if (!container || !container.getBoundingClientRect) {
      console.warn("Container not found for cursor movement");
      // Use fallback position
      this.onPositionChange({ x: 400, y: 300 });
      return;
    }

    const rect = container.getBoundingClientRect();
    const containerCenterX = rect.left + (rect.width / 2);
    
    // Calculate cursor position - center of viewport horizontally, section Y position
    let targetY = section.bbox?.y || rect.height / 2;
    
    // For PDF: scroll first, then position cursor pointing at the content
    if (this.previewMode === "deck") {
      // Calculate where to scroll - center the section in viewport
      const viewportHeight = container.clientHeight || window.innerHeight;
      const viewportCenter = viewportHeight / 2;
      const targetScrollY = Math.max(0, targetY - viewportCenter);
      
      // Force scroll - try multiple methods to ensure it works
      if (container.scrollTo) {
        container.scrollTo({
          top: targetScrollY,
          behavior: "smooth"
        });
      }
      
      // Also try direct scrollTop assignment as backup
      if (container.scrollTop !== undefined) {
        container.scrollTop = targetScrollY;
      }
      
      // Also try scrolling the window if container doesn't work
      if (container.scrollHeight === container.clientHeight) {
        window.scrollTo({
          top: targetScrollY,
          behavior: "smooth"
        });
      }
      
      // Position cursor at the content location (pointing at it with mouse pointer)
      // Wait a bit for scroll to start, then position cursor
      setTimeout(() => {
        const newRect = container.getBoundingClientRect();
        const contentX = newRect.left + (newRect.width / 2);
        const contentY = newRect.top + viewportCenter;
        this.onPositionChange({ x: contentX, y: contentY });
      }, 200);
      
      // Immediate position update (will be refined by timeout)
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
