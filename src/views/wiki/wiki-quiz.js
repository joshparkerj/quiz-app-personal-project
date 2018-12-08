import React, { Component } from 'react';
import {
  getWikiMC,
  getWikiMCbyCat,
  wikiSelection,
  getWikiCategories
} from '../../api';
import { toast } from 'react-toastify';
import WikiMC from './wiki-mc';

class WikiQuiz extends Component {

  constructor() {
    super();
    this.state = {
      wikiText: '',
      wikiID: null,
      wikiAnswers: [],
      wikiCategory: '',
      imgUrl: '',
      category: '',
      categories: [],
      selection: null
    }
  }

  componentDidMount() {
    getWikiMC()
      .then(mc => {
        if (mc && mc.text) {
          this.setState({
            wikiText: mc.text,
            wikiID: mc.id,
            wikiAnswers: mc.answers,
            wikiCategory: mc.category,
            imgUrl: mc.img_url
          });
        }
        getWikiCategories()
          .then(cats => {
            this.setState({
              category: cats[0].category,
              categories: cats
            })
          })
      })
  }

  hc = e => {
    wikiSelection(this.state.wikiID, e)
      .then(r => {
        console.log(r);
        if (r === 'correct') {
          toast.success('well done');
        } else {
          toast.error('that was very bad');
        }
      })
      .then(r => {
        getWikiMCbyCat(this.state.category)
          .then(mc => {
            if (mc && mc.text) {
              this.setState({
                wikiText: mc.text,
                wikiID: mc.id,
                wikiAnswers: mc.answers,
                wikiCategory: mc.category,
                imgUrl: mc.img_url
              });
            }
          })
      })
      .catch(err => {
        console.error(err);
      })
  }

  categoryMapper = (e, i) => {
    return <option value={e.category} key={i}>{e.category}</option>
  }

  handleChange = e => {
    const etv = e.target.value
    getWikiMCbyCat(etv)
      .then(mc => {
        this.setState({
          category: etv,
          wikiText: mc.text,
          wikiID: mc.id,
          wikiAnswers: mc.answers,
          wikiCategory: mc.category,
          imgUrl: mc.img_url
        })
      })
  }

  displayQuestion = () => {
    if (this.state.wikiText && this.state.wikiAnswers.length > 0) {
      return (
        <div className="multiple-choice-question">
          <select
            name="categories"
            onChange={this.handleChange}
            value={this.state.category}
          >
            {this.state.categories.map(this.categoryMapper)}
          </select>
          <WikiMC
            wikiText={this.state.wikiText}
            wikiAnswers={this.state.wikiAnswers}
            imgUrl={this.state.imgUrl}
            hc={this.hc} />
        </div>
      )
    } else {
      return (
        <div className="no-question-available">
          We have no question available for you. Check back again!
        </div>
      )
    }
  }

  render() {
    return (
      <div className="wiki-quiz">
        {this.displayQuestion()}
      </div>
    )
  }

}

export default WikiQuiz;
