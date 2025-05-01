import '../../css/leaderboard/leaderboards.css'
import search from '../../assets/search/search.svg'
import axios from 'axios'
import { API_URL, categories, levels } from '../../Constants'
import { useEffect, useState } from 'react'


export default function Leaderboard(){

    const [leaderboards, setLeaderboards] = useState([]);
    const [leaderboardsMastery, setLeaderboardsMastery] = useState([]);

    useEffect(()=>{
        fetchLeaderboards();
        fetchLeaderboardsMastery();
    }, []);

    const fetchLeaderboards = () => {
        const requests = [];
      
        categories.forEach(cat => {
          levels.forEach(level => {
            const url = `${API_URL}/getleaderboard?category=${cat.category}&level=${level}&mode=classic`;
            requests.push(axios.get(url));
          });
        });
      
        Promise.all(requests)
          .then(responses => {
            const allData = responses.flatMap(res => res.data);
            setLeaderboards(allData);
          })
          .catch(error => {
            console.error("Error fetching leaderboards:", error);
          });
      };
        

    const fetchLeaderboardsMastery = () => {
        const requests = [];
      
        categories.forEach(cat => {
          levels.forEach(level => {
            const url = `${API_URL}/getleaderboard?category=${cat.category}&level=${level}&mode=mastery`;
            requests.push(axios.get(url));
          });
        });
      
        Promise.all(requests)
          .then(responses => {
            const allData = responses.flatMap(res => res.data);
            setLeaderboardsMastery(allData);
          })
          .catch(error => {
            console.error("Error fetching leaderboards:", error);
          });
    };

    //classic sorting
    const rankedLeaders = [...leaderboards]
        .sort((a, b) => {
            const aScore = a.correct / a.total_items;
            const bScore = b.correct / b.total_items;

            if (bScore !== aScore) {
            return bScore - aScore; // Higher score ranks higher
            } else {
            return a.time_completion - b.time_completion; // Tie-breaker: faster time ranks higher
            }
        })
        .map((leader, index) => ({
            ...leader,
            rank: index + 1,
    }));


    //mastery sorting
    const rankedLeadersMastery = [...leaderboardsMastery]
        .sort((a, b) => {
            const aScore = a.correct / a.total_items;
            const bScore = b.correct / b.total_items;

            if (bScore !== aScore) {
            return bScore - aScore; 
            } else {
            return a.time_completion - b.time_completion; 
            }
        })
        .map((leader, index) => ({
            ...leader,
            rank: index + 1,
    }));


    return(
        <>
            <div className='leaderboard-body'>

                <div className='classic-cont'>

                    <div className='leaderboard-titles-cont'>
                        <h1 className='leaderboard-title classic-title'>Classic</h1>
                        <h2 className='leaderboard-subtitle'>top performing students in Classic</h2>
                    </div>

                    <div className='search-bar-cont-leaderboards'>
                        <div className='search-bar-leaderboards'>
                            <button className='search-btn-leaderboards'>
                                <img src={search}></img>
                            </button>
                            <input 
                                type='text'
                                placeholder='Search for a student'
                                className='search-input-leaderboards'

                            />
                        </div>
                    </div>

                    <div className='leaderboard-contents-container'>
                        <div className='content-header'>
                            <h1 className='title-header'>Rank</h1>
                            <h1 className='title-header'>Name</h1>
                            <h1 className='title-header'>World</h1>
                            <h1 className='title-header'>Score</h1>
                        </div>
                        <div className='leaders-main-container'>

                        {rankedLeaders.map((leader) => (
                            <div key={leader._id} className="leaders-container">
                                <div className="leader-info text-black">
                                {leader.rank === 1 ? "🥇" : leader.rank === 2 ? "🥈" : leader.rank === 3 ? "🥉" : leader.rank}
                                </div>
                                <div className="leader-info text-black font-bold">
                                {leader.user_id?.username || "Unknown User"}
                                </div>
                                <div className="leader-info text-black">{leader.category}</div>
                                <div className="leader-info text-black font-bold">
                                {leader.total_items > 0
                                    ? `${((leader.correct / leader.total_items) * 100).toFixed(0)}%` //rounds up para whole num
                                    : "N/A"}
                                </div>
                            </div>
                        ))}


                        </div>
                    </div>
                </div>


                <div className='mastery-cont'>
                    <div className='leaderboard-titles-cont'>
                        <h1 className='leaderboard-title mastery-title'>Mastery</h1>
                        <h2 className='leaderboard-subtitle'>top performing students in Mastery</h2>
                    </div>

                    <div className='search-bar-cont-leaderboards'>
                        <div className='search-bar-leaderboards'>
                            <button className='search-btn-leaderboards'>
                                <img src={search}></img>
                            </button>
                            <input 
                                type='text'
                                placeholder='Search for a student'
                                className='search-input-leaderboards'

                            />
                        </div>
                    </div>

                    <div className='leaderboard-contents-container'>
                        <div className='content-header'>
                            <h1 className='title-header'>Rank</h1>
                            <h1 className='title-header'>Name</h1>
                            <h1 className='title-header'>World</h1>
                            <h1 className='title-header'>Score</h1>
                        </div>
                        <div className='leaders-main-container'>


                            {rankedLeadersMastery.map((leader) => (
                                <div key={leader._id} className="leaders-container">
                                    <div className="leader-info text-black">
                                    {leader.rank === 1 ? "🥇" : leader.rank === 2 ? "🥈" : leader.rank === 3 ? "🥉" : leader.rank}
                                    </div>
                                    <div className="leader-info text-black font-bold">
                                    {leader.user_id?.username || "Unknown User"}
                                    </div>
                                    <div className="leader-info text-black">{leader.category}</div>
                                    <div className="leader-info text-black font-bold">
                                    {leader.total_items > 0
                                        ? `${((leader.correct / leader.total_items) * 100).toFixed(0)}%`
                                        : "N/A"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}