import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import
import {fade, makeStyles, withStyles} from '@material-ui/core/styles';
import Profile from './Profile';
import PieChart from "./PieChart";
import GhPolyglot from 'gh-polyglot';

const useStyles = makeStyles(theme => ({
    root: {
        width: '50%',
        margin: '0 auto',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
}));

const Results = props => {
    const classes = useStyles();
    const username = props.location.search;
    console.log(props)
    const [userData, setUserData] = useState(null);
    const [langData, setLangData] = useState(null);
    const [repoData, setRepoData] = useState(null);
    const [error, setError] = useState({ active: false, type: 200 });

    const getUserData = () => {
        fetch(`https://api.github.com/users/${username}`)
            .then(response => {
                if (response.status === 404) {
                    return setError({ active: true, type: 404 });
                }
                if (response.status === 403) {
                    return setError({ active: true, type: 403 });
                }
                return response.json();
            })
            .then(json => setUserData(json))
            .catch(error => {
                setError({ active: true, type: 400 });
                console.error('Error:', error);
            });
    };

    const getLangData = () => {
        const me = new GhPolyglot(`${username}`);
        me.userStats((err, stats) => {
            if (err) {
                console.error('Error:', err);
                setError({ active: true, type: 400 });
            }
            setLangData(stats);
        });
    };

    const getRepoData = () => {
        fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
            .then(response => {
                if (response.status === 404) {
                    return setError({ active: true, type: 404 });
                }
                if (response.status === 403) {
                    return setError({ active: true, type: 403 });
                }
                return response.json();
            })
            .then(json => setRepoData(json))
            .catch(error => {
                setError({ active: true, type: 200 });
                console.error('Error:', error);
            });
    };

    useEffect(() => {
        fetch(`https://api.github.com/rate_limit`)
            .then(response => response.json());

        getUserData();
        getLangData();
        getRepoData();

        // setUserData(mockUserData);
        // setLangData(mockLangData);
        // setRepoData(mockRepoData);
    }, []);

    return (
        <div className={classes.root}>
                <>
                    <h2>test</h2>
                    {userData && <Profile userData={userData}/>}
                        {/*<PieChart chartLabel="languages" data={testData}/>*/}
                        {/*<div style={{marginTop: '100px'}}>*/}
                            {/*{entries}*/}
                        {/*</div>*/}
                </>
            </div>
    )
};

Results.propTypes = {
    query: PropTypes.object,
};

export default Results;