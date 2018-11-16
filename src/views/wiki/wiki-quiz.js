import React, { Component } from 'react';
import {
  getWikiMC,
  getWikiMCbyCat,
  wikiSelection,
  getWikiCategories
} from '../../api';
import Option from './option';
import { toast } from 'react-toastify';

class WikiQuiz extends Component {

  constructor(){
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

  componentDidMount(){
    console.log('Wiki Quiz Component Did Mount');
    getWikiMC()
      .then(mc => {
        console.log('Got Wiki MC');
        console.log(mc);
        if(mc && mc.text){
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
            console.log('got cats');
            console.log(cats);
            this.setState({
              category: cats[0].category,
              categories: cats
            })
          })
      })
  }

  hc = e => {
    wikiSelection(this.state.wikiID,e)
      .then(r => {
        console.log(r);
        if(r==='correct'){
          toast.success('well done');
        } else {
          toast.error('that was very bad');
        }
      })
      .then(r => {
        getWikiMCbyCat(this.state.category)
          .then(mc => {
            if(mc && mc.text){
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

  optionMapper = (e,i) => {
    return (
      <Option
        hc={this.hc}
        key={i}
        text={e}
      />
    )
  }

  categoryMapper = (e,i) => {
    return <option value={e.category} key={i}>{e.category}</option>
  }

  handleChange = e => this.setState({category: e.target.value})

  displayQuestion = () => {
    if (this.state.wikiText && this.state.wikiAnswers.length > 0){
      return (
        <div className="multiple-choice-question">
          <select
            name="categories"
            onChange={this.handleChange}
            value={this.state.category}
          >
            {this.state.categories.map(this.categoryMapper)}
          </select>
          <img
            className="image-from-wiki"
            src={this.state.imgUrl || '/no_image.png'}
            alt="hope this helps!"
            onError={i => i.target.src = '/no_image.png'}
          />
          {this.state.wikiText}
          {this.state.wikiAnswers.map(this.optionMapper)}
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
