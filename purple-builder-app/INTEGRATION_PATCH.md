# Integration Instructions

The simulation components are created but need to be integrated into App.jsx. Here are the exact changes needed:

## 1. Add State Variables (after line 99)
Add these state variables:
```javascript
const [cursorPosition, setCursorPosition] = useState(null);
const [feedbackItems, setFeedbackItems] = useState([]);
const [simulationStatus, setSimulationStatus] = useState("");
const [elapsedSeconds, setElapsedSeconds] = useState(0);
const [isPaused, setIsPaused] = useState(false);
const simulationControllerRef = useRef(null);
const previewContainerRef = useRef(null);
```

## 2. Replace startSimulation function (around line 571)
Replace the entire function with the new implementation that uses SimulationController.

## 3. Add stopSimulation and pauseSimulation functions
Add these new functions after startSimulation.

## 4. Add ref to preview container (line 1129)
Change:
```javascript
<div style={{ flex: 1, background: "#FCFCFC"...
```
To:
```javascript
<div ref={previewContainerRef} style={{ flex: 1, background: "#FCFCFC"...
```

## 5. Add components to render
Add SimulationCursor and FeedbackOverlay inside the preview container.

## 6. Replace old simulation bar
Replace the old simulation bar UI with the new SimulationBar component.
