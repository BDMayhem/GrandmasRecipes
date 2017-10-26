import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { Button, Modal, FormGroup, ControlLabel, FormControl, Well, HelpBlock, Accordion, Panel, ListGroup, ListGroupItem, Grid, Row, Col } from 'react-bootstrap';
import SearchInput, { createFilter } from 'react-search-input';

let recipes = [{name: 'Hamburger', ingredients: 'Beef, Bun, Mustard, Pickle', directions: 'make burger, eat it', key: 0}, {name: 'Hamburger Helper', ingredients: 'Hamburger don\'t need no help', directions: 'Just make a burger instead', key: 1}];

let recipeCounter = recipes.length;
const KEYS_TO_FILTER = ['name', 'ingredients', 'directions'];

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      currentRecipe: {key: null},
      searchTerm: '',
      searchResults: recipes
    }
    
    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.save = this.save.bind(this);
    this.searchUpdated = this.searchUpdated.bind(this);
    this.secondaryAddRecipe = this.secondaryAddRecipe.bind(this);
  }
  
  open() {
    this.setState({ show: true });
  }

  close() {
    this.setState({
      show: false,
      currentRecipe: {key: null}
    });
  }

  save(name, ingredients, directions) {
    if(this.state.currentRecipe.key !== null) {
      const toSave = recipes.findIndex(i => Number(i.key) === Number(this.state.currentRecipe.key));
      recipes.splice(toSave, 1, {name: name, ingredients: ingredients, directions: directions, key: Number(this.state.currentRecipe.key)})

    } else {
      recipes.push({name: name, ingredients: ingredients, directions: directions, key: Number(recipeCounter)});
      recipeCounter++;
    }

    this.setState({
      show: false,
      currentRecipe: {key: null}
    }, 
    () => {
      console.log(recipes)
      this.searchUpdated(this.state.searchTerm);
      write();
    })
  }

  edit(event) {
    const toEdit = this.state.searchResults.findIndex(i => Number(event.target.dataset.index) === i.key);

    this.setState({
      show: true,
      currentRecipe: {
        name: this.state.searchResults[toEdit].name,
        ingredients: this.state.searchResults[toEdit].ingredients,
        directions: this.state.searchResults[toEdit].directions,
        key: this.state.searchResults[toEdit].key
      }
    });
  }

  delete(event) {
    const toDelete = recipes.findIndex(i => i.key === Number(event.target.dataset.index));
    recipes.splice(toDelete, 1);
    this.searchUpdated(this.state.searchTerm);
    write();
  }

  searchUpdated(term) {
    const filteredRecipes = recipes.filter(createFilter(term, KEYS_TO_FILTER));
    this.setState({
      searchTerm: term,
      searchResults: filteredRecipes
    });
  }

  secondaryAddRecipe() {
    document.getElementById('add-recipe').click();
  }

  render() {
    return(
      <div className='container'>
        <header>
          <h1 className="text-center">Grandma's Recipes</h1>
          <SearchInput
            className="search-input"
            onChange={this.searchUpdated}
          />
          <Button
            onClick={this.secondaryAddRecipe}
            bsSize='small'
            bsStyle='primary'
            id='secondary-add-recipe'
          >
            Add Recipe
          </Button>
        </header>
        <Well>
          <Accordion>
            {this.state.searchResults.map((recipe) => 
              <Panel header={recipe.name} eventKey={recipe.key} key={recipe+recipe.key} bsStyle="success">
                <Grid fluid={true}>
                  <Row className="show-grid">
                    <Col md={4}>
                      <ListGroup>
                        Ingredients
                        {recipe.ingredients.split(', ').map((ingredient) => 
                          <ListGroupItem key={ingredient+recipe.key}>{ingredient}</ListGroupItem>
                        )}
                      </ListGroup>
                    </Col>
                    <Col md={8}>
                      <ListGroup>
                        Directions
                        {recipe.directions.split(', ').map((direction) => 
                          <ListGroupItem key={direction+recipe.key}>{direction}</ListGroupItem>
                        )}
                      </ListGroup>
                    </Col>
                  </Row>
                </Grid>
                <Button onClick={this.edit} bsStyle='primary' data-index={recipe.key}>Edit</Button>
                <Button onClick={this.delete} bsStyle='danger' data-index={recipe.key}>Delete</Button>
              </Panel>
            )}
          </Accordion>
        </Well>
        <AddRecipe
          show={this.state.show}
          open={this.open}
          close={this.close}
          save={this.save}
          size="large"
          name={this.state.currentRecipe.name}
          ingredients={this.state.currentRecipe.ingredients}
          directions={this.state.currentRecipe.directions}
          editing={this.state.currentRecipe.key}
        />
      </div>
    );
  }
}

class AddRecipe extends React.Component {
  constructor(props) {
    super(props);
    this.save = this.save.bind(this)
  }

  save(e) {
    e.preventDefault();
    this.props.save(
      document.getElementById('recipe-name').value,
      document.getElementById('ingredients').value,
      document.getElementById('directions').value
    )
  }

  render() {
    return(
      <div className='modal-container'>
        <Button
          id='add-recipe'
          bsStyle='primary'
          bsSize={this.props.size}
          onClick={this.props.open}
        >
          Add Recipe
        </Button>

        <Modal
          show={this.props.show}
          onHide={this.props.close}
          container={this}
          aria-labelledby='contained-modal-title'
        >
          <Modal.Header closeButton>
            <Modal.Title id='contained-modal-title'>Add recipe</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={this.save}>
              <FormGroup
                controlId='recipe-name'
              >
                <ControlLabel>Recipe Name</ControlLabel>
                <FormControl
                  defaultValue={ this.props.name }
                  type='text'
                  placeholder='What is this recipe called?'
                />
              </FormGroup>
              <FormGroup
                controlId='ingredients'
              >
                <ControlLabel>Ingredients</ControlLabel>
                <FormControl
                  defaultValue={ this.props.ingredients }
                  componentClass='textarea'
                  placeholder='What goes in this recipe'
                />
                <HelpBlock>Separate ingredients with commas (e.g <em>1 cup flour, 2 cups milk</em>)</HelpBlock>
              </FormGroup>
              <FormGroup
                controlId='directions'
              >
                <ControlLabel>Directions</ControlLabel>
                <FormControl
                  defaultValue={ this.props.directions }
                  componentClass='textarea'
                  placeholder='How do you make this recipe?'
                />
              </FormGroup>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.save} bsStyle='success' type='submit'>Save</Button>
            <Button onClick={this.props.close} bsStyle='warning'>Cancel</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

function read() {
  if (localStorage['recipes'] === undefined) {
      localStorage.setItem('recipes', JSON.stringify(recipes));
  }
  
  if(localStorage['recipeCounter']) {
    recipeCounter = localStorage['recipeCounter']
  } else {
    localStorage.setItem('recipeCounter', recipeCounter);
  }

  recipes = JSON.parse(localStorage['recipes']);

  ReactDOM.render(<App />, document.getElementById('root'));
}

function write() {
  localStorage.setItem('recipes', JSON.stringify(recipes));
  localStorage.setItem('recipeCounter', recipeCounter);
  read();
}

read();
registerServiceWorker();
