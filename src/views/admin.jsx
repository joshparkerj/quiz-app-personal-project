import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import {
  scrapeWiki,
  getWikiCategories,
  getEntireCategory,
  deleteWikiQuestion,
  updateWikiQuestion,
} from '../api';

import './admin.css';

const Admin = function Admin() {
  const [disablescrape, setDisablescrape] = useState(false);
  const [scrapebuttontext, setScrapebuttontext] = useState('Scrape Wiki');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [showUpdate, setShowUpdate] = useState(false);
  const [toUpdate, setToUpdate] = useState(null);
  const [updateAnswer, setUpdateAnswer] = useState('');
  const [updatetext, setUpdatetext] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleteAnswer, setDeleteAnswer] = useState('');
  const [term, setTerm] = useState('');

  useEffect(() => {
    getWikiCategories()
      .then((cats) => {
        setCategory(cats[0].category);
        setCategories(cats);
      });
  }, []);

  const scrape = () => {
    setTerm('');
    setDisablescrape(true);
    setScrapebuttontext('Please wait...');

    scrapeWiki(term)
      .then(() => getWikiCategories())
      .then((cats) => {
        setCategory(cats[0].category);
        setCategories(cats);
        setDisablescrape(false);
        setScrapebuttontext('Scrape Wiki');
      });
  };

  const showQuestions = () => {
    getEntireCategory(category)
      .then((r) => {
        setQuestions(r);
      });
  };

  const deleteQuestion = (id, answer) => {
    setToDelete(id);
    setShowDelete(true);
    setShowUpdate(false);
    setDeleteAnswer(answer);
  };

  const updateQuestion = (id, text, answer) => {
    setToUpdate(id);
    setUpdatetext(text);
    setShowUpdate(true);
    setShowDelete(false);
    setUpdateAnswer(answer);
  };

  const questionMapper = (e, i) => (
    <div className={`question${e.id}`} key={i}>
      <h4>{e.answer}</h4>
      <p className="admin-qtext">{e.text}</p>
      <button type="submit" onClick={() => deleteQuestion(e.id, e.answer)}>
        Delete This Question
      </button>
      <button type="submit" onClick={() => updateQuestion(e.id, e.text, e.answer)}>
        Update This Question
      </button>
    </div>
  );

  const handleShowDelete = () => (
    <div className="admin-delete">
      <h4>{deleteAnswer}</h4>
      <h4>Are you sure you wish to delete?</h4>
      <button
        type="submit"
        onClick={() => {
          deleteWikiQuestion(toDelete)
            .then(() => getEntireCategory(category))
            .then((r) => {
              toast.success('deleted!');
              setShowDelete(false);
              setQuestions(r);
            });
        }}
      >
        Yes!
      </button>
      <button type="button" onClick={() => setShowDelete(false)}>
        No...
      </button>
    </div>
  );

  const handleShowUpdate = () => (
    <div className="admin-update">
      <h4>{updateAnswer}</h4>
      <h4>Tweak text:</h4>
      <textarea
        name="updatetext"
        value={updatetext}
        onChange={({ target }) => setUpdatetext(target.value)}
      />
      <button
        type="submit"
        onClick={() => {
          updateWikiQuestion(toUpdate, updatetext)
            .then(() => getEntireCategory(category))
            .then((r) => {
              toast.success('updated!');
              setShowUpdate(false);
              setQuestions(r);
            });
        }}
      >
        Confirm!
      </button>
      <button type="button" onClick={() => setShowUpdate(false)}>
        Never mind...
      </button>
    </div>
  );

  const categoryMapper = (e, i) => <option value={e.category} key={i}>{e.category}</option>;

  return (
    <div className="admin">
      <h1>Admin Options:</h1>
      <input
        onChange={({ target }) => setTerm(target.value)}
        name="term"
        value={term}
      />
      <button
        type="button"
        onClick={scrape}
        disabled={disablescrape}
      >
        {scrapebuttontext}
      </button>
      <p>
        Note: The scrape wiki operation takes a while;
        sometimes over a minute.
      </p>
      <h4>Tweak the wiki questions:</h4>
      <label htmlFor="cateogry">
        Select a category:
        <select
          name="category"
          onChange={({ target }) => setCategory(target.value)}
          value={category}
        >
          {categories.map(categoryMapper)}
        </select>
      </label>
      <button type="button" onClick={showQuestions}>
        Show Entire Category
      </button>
      {
        questions.length > 0
          ? questions.map(questionMapper)
          : ''
      }
      {showDelete ? handleShowDelete() : ''}
      {showUpdate ? handleShowUpdate() : ''}
    </div>
  );
};

export default Admin;
