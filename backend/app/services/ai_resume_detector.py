
import re
from collections import Counter


# Common generic resume expressions.
# These are indicators only, not proof of AI authorship.
GENERIC_PHRASES = [
    "results-driven professional",
    "highly motivated individual",
    "proven track record",
    "passionate about delivering",
    "strong problem-solving skills",
    "excellent communication skills",
    "dynamic and innovative",
    "responsible for various tasks",
    "leveraged cutting-edge technology",
    "spearheaded initiatives",
    "demonstrated expertise",
    "committed to excellence",
]


def split_sentences(text: str) -> list:
    """Split resume text into approximate sentences."""
    sentences = re.split(r"(?<=[.!?])\s+", text.strip())

    return [
        sentence.strip()
        for sentence in sentences
        if len(sentence.split()) >= 3
    ]


def analyze_repeated_phrases(text: str) -> dict:
    """Find repeated sequences of three words."""

    words = re.findall(r"\b[a-zA-Z]+\b", text.lower())

    phrases = [
        " ".join(words[index:index + 3])
        for index in range(len(words) - 2)
    ]

    counts = Counter(phrases)

    repeated = [
        phrase
        for phrase, count in counts.items()
        if count > 1
    ]

    return {
        "count": len(repeated),
        "examples": repeated[:5]
    }


def analyze_sentence_openings(sentences: list) -> dict:
    """Find repeated sentence beginnings."""

    openings = []

    for sentence in sentences:
        words = re.findall(r"\b[a-zA-Z]+\b", sentence.lower())

        if len(words) >= 2:
            openings.append(" ".join(words[:2]))

    counts = Counter(openings)

    repeated = [
        opening
        for opening, count in counts.items()
        if count > 1
    ]

    return {
        "count": len(repeated),
        "examples": repeated[:5]
    }


def analyze_sentence_lengths(sentences: list) -> dict:
    """Measure consistency in sentence lengths."""

    lengths = [
        len(sentence.split())
        for sentence in sentences
    ]

    if len(lengths) < 3:
        return {
            "average": 0,
            "variation": None,
            "consistency": "Insufficient data"
        }

    average = sum(lengths) / len(lengths)

    variance = sum(
        (length - average) ** 2
        for length in lengths
    ) / len(lengths)

    standard_deviation = variance ** 0.5

    coefficient = (
        standard_deviation / average
        if average > 0 else 0
    )

    if coefficient < 0.25:
        consistency = "Very consistent"
    elif coefficient < 0.50:
        consistency = "Moderately varied"
    else:
        consistency = "Highly varied"

    return {
        "average": round(average, 2),
        "variation": round(coefficient, 3),
        "consistency": consistency
    }


def analyze_generic_phrases(text: str) -> dict:
    """Detect predefined generic resume expressions."""

    normalized_text = text.lower()

    found = [
        phrase
        for phrase in GENERIC_PHRASES
        if phrase in normalized_text
    ]

    return {
        "count": len(found),
        "examples": found
    }


def analyze_vocabulary_variation(text: str) -> dict:
    """Calculate a simple lexical diversity measure."""

    words = re.findall(r"\b[a-zA-Z]+\b", text.lower())

    if not words:
        return {
            "unique_word_ratio": 0,
            "total_words": 0
        }

    unique_words = set(words)

    return {
        "unique_word_ratio": round(
            len(unique_words) / len(words), 3
        ),
        "total_words": len(words)
    }


def analyze_ai_writing(text: str) -> dict:
    """
    Calculate a heuristic AI-like writing indicator.

    This score is not a probability and cannot establish
    whether a resume was written by AI.
    """

    if not isinstance(text, str):
        text = ""

    text = text.strip()

    words = re.findall(r"\b[a-zA-Z]+\b", text)

    if len(words) < 80:
        return {
            "status": "insufficient_text",
            "message": (
                "At least 80 words are needed for this "
                "preliminary writing-pattern analysis."
            ),
            "word_count": len(words),
            "ai_like_writing_score": None,
            "interpretation": None,
            "indicators": {}
        }

    sentences = split_sentences(text)

    repeated_phrases = analyze_repeated_phrases(text)
    repeated_openings = analyze_sentence_openings(sentences)
    sentence_lengths = analyze_sentence_lengths(sentences)
    generic_phrases = analyze_generic_phrases(text)
    vocabulary = analyze_vocabulary_variation(text)

    # Transparent heuristic points.
    # These weights are experimental, not statistically validated.
    score = 0

    if repeated_phrases["count"] >= 3:
        score += 20
    elif repeated_phrases["count"] >= 1:
        score += 10

    if repeated_openings["count"] >= 3:
        score += 20
    elif repeated_openings["count"] >= 1:
        score += 10

    if sentence_lengths["variation"] is not None:
        if sentence_lengths["variation"] < 0.25:
            score += 20
        elif sentence_lengths["variation"] < 0.40:
            score += 10

    if generic_phrases["count"] >= 3:
        score += 25
    elif generic_phrases["count"] >= 1:
        score += 10

    if vocabulary["unique_word_ratio"] < 0.35:
        score += 15

    score = min(score, 100)

    if score >= 60:
        interpretation = "Many AI-like writing patterns detected"
    elif score >= 30:
        interpretation = "Some AI-like writing patterns detected"
    else:
        interpretation = "Few AI-like writing patterns detected"

    return {
        "status": "completed",
        "word_count": len(words),
        "ai_like_writing_score": score,
        "interpretation": interpretation,
        "indicators": {
            "repeated_phrases": repeated_phrases,
            "repeated_sentence_openings": repeated_openings,
            "sentence_length_analysis": sentence_lengths,
            "generic_resume_phrases": generic_phrases,
            "vocabulary_variation": vocabulary
        },
        "disclaimer": (
            "This experimental score measures writing patterns, "
            "not AI authorship. Human-written text can show these "
            "patterns, and AI-generated text may not show them."
        )
    }
