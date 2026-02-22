'use client';

import React, { useState } from 'react';
import { Quiz, QuizAttempt } from '@/lib/types';
import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineLightBulb, HiOutlineClock, HiOutlineArrowRight, HiOutlineArrowPath } from 'react-icons/hi2';

interface QuizPlayerProps {
    quiz: Quiz;
    lessonId: string;
    userId: string;
    onPass: (attempt: QuizAttempt) => void;
    onRetry?: () => void;
    existingAttempt?: QuizAttempt;
}

export default function QuizPlayer({ quiz, lessonId, userId, onPass, existingAttempt }: QuizPlayerProps) {
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>(new Array(quiz.questions.length).fill(null));
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState<QuizAttempt | null>(existingAttempt || null);
    const [showExplanation, setShowExplanation] = useState<boolean[]>(new Array(quiz.questions.length).fill(false));

    if (result && result.passed) {
        return (
            <div className="quiz-result-container">
                <div className="quiz-passed">
                    <div className="quiz-result-icon passed">
                        <HiOutlineCheckCircle />
                    </div>
                    <h3>Quiz Passed! 🎉</h3>
                    <p>You scored <strong>{result.score}%</strong> (Required: {quiz.passingScore}%)</p>
                    <p className="text-muted" style={{ fontSize: '13px' }}>
                        {result.score === 100 ? 'Perfect score! Excellent work!' : 'Great job! You can proceed to the next lesson.'}
                    </p>
                </div>
            </div>
        );
    }

    const question = quiz.questions[currentQ];

    const selectAnswer = (optionIndex: number) => {
        if (submitted) return;
        const newAnswers = [...answers];
        newAnswers[currentQ] = optionIndex;
        setAnswers(newAnswers);
    };

    const goNext = () => {
        if (currentQ < quiz.questions.length - 1) {
            setCurrentQ(currentQ + 1);
        }
    };

    const goPrev = () => {
        if (currentQ > 0) {
            setCurrentQ(currentQ - 1);
        }
    };

    const submitQuiz = () => {
        let correct = 0;
        quiz.questions.forEach((q, i) => {
            if (answers[i] === q.correctAnswer) correct++;
        });
        const score = Math.round((correct / quiz.questions.length) * 100);
        const passed = score >= quiz.passingScore;

        const attempt: QuizAttempt = {
            quizId: quiz.id,
            lessonId,
            userId,
            answers: answers.map(a => a ?? -1),
            score,
            passed,
            attemptedAt: new Date().toISOString(),
        };

        setResult(attempt);
        setSubmitted(true);

        if (passed) {
            onPass(attempt);
        }
    };

    const retryQuiz = () => {
        setAnswers(new Array(quiz.questions.length).fill(null));
        setCurrentQ(0);
        setSubmitted(false);
        setResult(null);
        setShowExplanation(new Array(quiz.questions.length).fill(false));
    };

    const toggleExplanation = (idx: number) => {
        const next = [...showExplanation];
        next[idx] = !next[idx];
        setShowExplanation(next);
    };

    const answeredCount = answers.filter(a => a !== null).length;
    const allAnswered = answeredCount === quiz.questions.length;

    // After submission — show results with review
    if (submitted && result) {
        return (
            <div className="quiz-result-container">
                <div className={`quiz-result-banner ${result.passed ? 'passed' : 'failed'}`}>
                    <div className="quiz-result-icon">
                        {result.passed ? <HiOutlineCheckCircle /> : <HiOutlineXCircle />}
                    </div>
                    <h3>{result.passed ? 'Quiz Passed! 🎉' : 'Quiz Not Passed'}</h3>
                    <p>You scored <strong>{result.score}%</strong> — Required: {quiz.passingScore}%</p>
                </div>

                <div className="quiz-review">
                    <h4 style={{ fontWeight: 600, marginBottom: '16px' }}>Review Answers</h4>
                    {quiz.questions.map((q, i) => {
                        const isCorrect = answers[i] === q.correctAnswer;
                        return (
                            <div key={q.id} className={`quiz-review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                                <div className="review-question">
                                    <span className="review-num">{i + 1}</span>
                                    <span>{q.question}</span>
                                    {isCorrect ? <HiOutlineCheckCircle className="review-icon correct" /> : <HiOutlineXCircle className="review-icon incorrect" />}
                                </div>
                                <div className="review-options">
                                    {q.options.map((opt, oi) => (
                                        <div
                                            key={oi}
                                            className={`review-option ${oi === q.correctAnswer ? 'correct-option' : ''} ${oi === answers[i] && oi !== q.correctAnswer ? 'wrong-option' : ''}`}
                                        >
                                            {opt}
                                            {oi === q.correctAnswer && <span className="correct-badge">✓ Correct</span>}
                                            {oi === answers[i] && oi !== q.correctAnswer && <span className="wrong-badge">✗ Your answer</span>}
                                        </div>
                                    ))}
                                </div>
                                {q.explanation && (
                                    <>
                                        <button className="explanation-toggle" onClick={() => toggleExplanation(i)}>
                                            <HiOutlineLightBulb /> {showExplanation[i] ? 'Hide' : 'Show'} Explanation
                                        </button>
                                        {showExplanation[i] && <div className="explanation-text">{q.explanation}</div>}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>

                {!result.passed && (
                    <button className="btn-primary-custom w-100" onClick={retryQuiz}>
                        <HiOutlineArrowPath /> Retry Quiz
                    </button>
                )}
            </div>
        );
    }

    // Active quiz
    return (
        <div className="quiz-player">
            <div className="quiz-header">
                <div>
                    <h3 className="quiz-title">📝 {quiz.title}</h3>
                    {quiz.description && <p className="quiz-desc">{quiz.description}</p>}
                </div>
                <div className="quiz-meta">
                    <span className="quiz-progress-text">{answeredCount}/{quiz.questions.length} answered</span>
                    <span className="quiz-passing">Pass: {quiz.passingScore}%</span>
                </div>
            </div>

            <div className="quiz-progress-bar">
                <div className="quiz-progress-fill" style={{ width: `${((currentQ + 1) / quiz.questions.length) * 100}%` }} />
            </div>

            <div className="quiz-question-card">
                <div className="question-number">Question {currentQ + 1} of {quiz.questions.length}</div>
                <h4 className="question-text">{question.question}</h4>

                <div className="quiz-options">
                    {question.options.map((option, idx) => (
                        <button
                            key={idx}
                            className={`quiz-option ${answers[currentQ] === idx ? 'selected' : ''}`}
                            onClick={() => selectAnswer(idx)}
                        >
                            <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                            <span className="option-text">{option}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="quiz-nav">
                <button className="btn-secondary-custom" onClick={goPrev} disabled={currentQ === 0}>
                    Previous
                </button>

                <div className="quiz-dots">
                    {quiz.questions.map((_, i) => (
                        <button
                            key={i}
                            className={`quiz-dot ${i === currentQ ? 'active' : ''} ${answers[i] !== null ? 'answered' : ''}`}
                            onClick={() => setCurrentQ(i)}
                        />
                    ))}
                </div>

                {currentQ < quiz.questions.length - 1 ? (
                    <button className="btn-primary-custom" onClick={goNext} disabled={answers[currentQ] === null}>
                        Next <HiOutlineArrowRight />
                    </button>
                ) : (
                    <button className="btn-primary-custom" onClick={submitQuiz} disabled={!allAnswered}>
                        Submit Quiz
                    </button>
                )}
            </div>

            {quiz.timeLimit && (
                <div className="quiz-timer">
                    <HiOutlineClock /> Time Limit: {Math.floor(quiz.timeLimit / 60)} min
                </div>
            )}
        </div>
    );
}
