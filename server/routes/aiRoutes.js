import express from 'express';
import {
  analyzeResumeMatch,
  generateCoverLetter,
  processCopilotChat,
  analyzeApplicantForRecruiter,
  generateRejectionFeedback,
  analyzeSkillRoadmap,
  handleGeminiChat,
} from '../controllers/aiController.js';

const router = express.Router();

// POST /api/ai/analyze-resume
router.post('/analyze-resume', analyzeResumeMatch);

// POST /api/ai/generate-cover-letter
router.post('/generate-cover-letter', generateCoverLetter);

// POST /api/ai/chat (Official Gemini Chatbot Endpoint)
router.post('/chat', handleGeminiChat);

// POST /api/ai/copilot
router.post('/copilot', processCopilotChat);

// POST /api/ai/recruiter-analyze
router.post('/recruiter-analyze', analyzeApplicantForRecruiter);

// POST /api/ai/rejection-feedback
router.post('/rejection-feedback', generateRejectionFeedback);

// POST /api/ai/skill-roadmap
router.post('/skill-roadmap', analyzeSkillRoadmap);

export default router;


