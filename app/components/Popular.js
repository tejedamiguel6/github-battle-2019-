import React from 'react'
import PropTypes from 'prop-types'
import { fetchPopularRepos } from '../utils/api'
import { FaUser, FaStar, FaCodeBranch, FaExclamationTriangle, FaCode } from 'react-icons/fa'
import Card from './Card'
import Loading from './Loading'
import Tooltip from './Tooltip'


function LanguagesNav ({ selected, onupdateLanguage }) {
    const languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python']
    return (
        <ul className='flex-center'>
          {languages.map((language)=> (
              <li key={language}>
                <button
                 className='btn-clear nav-link'
                 style={language ===  selected ? { color: 'rgb(255,0,255)'} : null }
                 onClick={()=> onupdateLanguage (language)}>
                    {language}
                </button>
              </li>
          ))}
        </ul>
    )
} 
//end LanguageNav func


//Setting my propTypes
LanguagesNav.propTypes ={
    selected: PropTypes.string.isRequired,
    onupdateLanguage: PropTypes.func.isRequired
}



function ReposGrid ({ repos }) {
    return (
        <ul className='grid space-around'>
            {repos.map((repo, index) => {
                const {name, owner, html_url, stargazers_count, forks, open_issues } = repo
                const { login, avatar_url } = owner
                
                return (
                    <li key={html_url} >
                        <Card
                            header={`#${index + 1}`}
                            avatar={avatar_url}
                            href={html_url}
                            name={login}

                        >

                      <ul className='card-list'>
                            <li>
                                <Tooltip text='Github username'>
                                    <FaUser color='rgb(155, 191, 116)' size={22} />
                                    <a href={`https://github.com/${login}`}>
                                        {login}
                                    </a>
                                </Tooltip>
                            </li>
                            <li>
                                <FaStar color='rgb(255, 215, 0)' size={22} />
                                {stargazers_count.toLocaleString()} stars
                            </li>

                            <li>
                                <FaCodeBranch color='rgb(129, 195, 245)' size={22} />
                                {forks.toLocaleString()} forks
                         
                            </li>
                            <li>
                                <FaExclamationTriangle color='rgb(241, 138, 147)' size={22} />
                                {open_issues.toLocaleString()} open
                            </li>
        
                        </ul>
                    </Card>
                    </li>
                )
            })}
        </ul>
    )
}

ReposGrid.propTypes = {
    repos: PropTypes.array.isRequired
}



//New component that holds my logic
export default class Popular extends React.Component {
   //setting state
    state = {
        selectedLanguage: 'All',
        repos: {}, 
        error: null
    }
    componentDidMount () {
        this.updateLanguage(this.state.selectedLanguage)
    }

    //updating the state
    updateLanguage = (selectedLanguage) => {
        this.setState({
            selectedLanguage,
            error: null,
        })

        //If the state of the language chosen is NOT equal to
        //the language the user chose 
        if(!this.state.repos[selectedLanguage]) {
            fetchPopularRepos(selectedLanguage)
                .then((data) => {
                    this.setState(({ repos }) =>({
                        repos: {
                            ...repos,
                            [selectedLanguage]:data
                        }

                    }))
                })
                .catch(() => {
                    console.log('Error fetching repos', error)
        
                    this.setState({
                        error: 'There was an error fetching your repositories'
                    })
                })
        }

    }

    isLoading = () => {
        const { selectedLanguage, repos, error } = this.state

        return !repos[selectedLanguage] && error === null 

    }
    render () {
        //destructuring
        const { selectedLanguage, repos, error } = this.state
        return (
            
            <React.Fragment>
                
                <LanguagesNav
                selected={selectedLanguage}
                onupdateLanguage={this.updateLanguage}
                />
                {this.isLoading() && <Loading text='Fetching Repos'/> }

                {error && <p className='center-text error'>{error}</p>}
                {repos[selectedLanguage] && <ReposGrid repos = {repos[selectedLanguage]} />}
            </React.Fragment>
        )
    }
   
}
















