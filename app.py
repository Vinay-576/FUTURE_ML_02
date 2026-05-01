import streamlit as st
import pandas as pd
import re
import spacy
import nltk
from nltk.corpus import stopwords

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# Setup
nltk.download('stopwords')
nlp = spacy.load("en_core_web_sm")
nltk_stop_words = set(stopwords.words('english'))

st.title("🎫 AI Support Ticket Classifier (No Joblib)")

# 🔹 Cleaning Function
def advanced_nlp_clean(text):
    if not isinstance(text, str):
        return ""

    text = re.sub(r'\{.*?\}', '', text.lower())
    text = re.sub(r'\b\d+\.\d+(\.\d+)?\b', '', text)
    text = re.sub(r'[\n\t\r]', ' ', text)

    doc = nlp(text)

    tokens = []
    for token in doc:
        if token.is_alpha:
            if token.text in ["not", "no", "never"]:
                tokens.append(token.text)
            elif token.text not in nltk_stop_words:
                tokens.append(token.lemma_)

    return " ".join(tokens)


# 🔹 Load Data
@st.cache_data
def load_data():
    df = pd.read_csv("cleaned_ticket.csv")
    return df

df = load_data()


# 🔹 Train Models (cached)
@st.cache_resource
def train_models(df):
    X = df["clean_text"]
    y_cat = df["category"]
    y_pri = df["priority"]

    tfidf = TfidfVectorizer(max_features=5000, ngram_range=(1,2))
    X_vec = tfidf.fit_transform(X)

    model_cat = LogisticRegression(max_iter=200)
    model_pri = LogisticRegression(max_iter=200)

    model_cat.fit(X_vec, y_cat)
    model_pri.fit(X_vec, y_pri)

    return tfidf, model_cat, model_pri


tfidf, model_category, model_priority = train_models(df)


# 🔹 UI Input
text = st.text_area("Enter your issue:")


# 🔹 Prediction
if st.button("Predict"):
    if text:
        cleaned = advanced_nlp_clean(text)
        vectorized = tfidf.transform([cleaned])

        cat = model_category.predict(vectorized)[0]
        pri = model_priority.predict(vectorized)[0]

        # Rule boost
        urgent_words = ["angry", "refund", "money back", "not working", "broken", "worst"]

        if any(word in cleaned for word in urgent_words):
            pri = "high"

        if "refund" in cleaned or "money back" in cleaned:
            cat = "complaint"

        st.subheader("🔍 Result")
        st.write("**Cleaned Text:**", cleaned)
        st.success(f"Category: {cat}")
        st.warning(f"Priority: {pri}")

    else:
        st.error("Please enter some text")