import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Send, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import Card from '../Card/Card';
import Button from '../Button/Button';
import { aiService } from '../../services/aiService';

const AIInterviewCoach = () => {
  const [category, setCategory] = useState('Technical'); // Technical, HR, Coding
  const [questionData, setQuestionData] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const loadQuestion = async (cat) => {
    setFeedback(null);
    setUserAnswer('');
    const data = await aiService.generateInterviewQuestion(cat);
    setQuestionData(data);
  };

  useEffect(() => {
    loadQuestion(category);
  }, [category]);

  const handleEvaluate = async (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;
    setEvaluating(true);
    const result = await aiService.evaluateInterviewAnswer(userAnswer);
    setFeedback(result);
    setEvaluating(false);
  };

  return (
    <Card variant="glass" className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-emerald-400" /> AI Mock Interview Coach
          </h3>
          <p className="text-slate-400 text-xs mt-1">
            Practice real technical, HR, and coding questions with automated AI response scoring.
          </p>
        </div>

        {/* Category Selector */}
        <div className="flex gap-1.5">
          {['Technical', 'HR', 'Coding'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                category === cat
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {questionData && (
        <div className="space-y-6">
          {/* Question Box */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {category} Interview Prompt
              </span>
              <button
                type="button"
                onClick={() => loadQuestion(category)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Next Question
              </button>
            </div>

            <h4 className="text-base font-bold text-white mb-2">{questionData.question}</h4>
            <p className="text-xs text-slate-400 italic">💡 Hint: {questionData.hint}</p>
          </div>

          {/* User Answer Textarea */}
          <form onSubmit={handleEvaluate} className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Your Answer / Code Response
            </label>
            <textarea
              rows={4}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your structured response here..."
              className="w-full rounded-2xl bg-slate-800/80 border border-slate-700 p-4 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={evaluating || !userAnswer.trim()}
                icon={Sparkles}
              >
                {evaluating ? 'AI is Scoring Response...' : 'Evaluate Answer with AI'}
              </Button>
            </div>
          </form>

          {/* AI Feedback Report */}
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border border-emerald-500/40 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> AI Evaluation Score
                </span>
                <span className="text-2xl font-black text-emerald-400">{feedback.score} / 100</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">{feedback.feedback}</p>
              {feedback.suggestedRefinement && (
                <p className="text-xs text-emerald-300/80 font-medium italic">
                  Tip: {feedback.suggestedRefinement}
                </p>
              )}
            </motion.div>
          )}
        </div>
      )}
    </Card>
  );
};

export default AIInterviewCoach;
