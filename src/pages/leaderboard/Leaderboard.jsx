import '../../css/leaderboard/leaderboards.css'
import search from '../../assets/search/search.svg'
import axios from 'axios'
import { API_URL, categories, levels } from '../../Constants'
import { useEffect, useState } from 'react'


export default function Leaderboard(){

    const [leaderboards, setLeaderboards] = useState([]);
    const [leaderboardsMastery, setLeaderboardsMastery] = useState([]);
    const [searchClassic, setSearchClassic] = useState('');
    const [searchMastery, setSearchMastery] = useState('');


    useEffect(()=>{
        fetchTopLeaderboards();
        fetchTopLeaderboardsMastery();
    }, []);

    const fetchTopLeaderboards = async () => {
        try {
          
          const response = await axios.get(`${API_URL}/getTopLeaderboards`, {
            params: {
              mode: 'classic'
            }
          });
      
          console.log(response.data); 
          setLeaderboards(response.data);
        } catch (error) {
          console.error('Error fetching top leaderboards:', error.message);
        }
    };

    const fetchTopLeaderboardsMastery = async () => {
        try {
          
          const response = await axios.get(`${API_URL}/getTopLeaderboards`, {
            params: {
              mode: 'mastery'
            }
          });
      
          console.log(response.data); // Check if data is returned
          setLeaderboardsMastery(response.data);
        } catch (error) {
          console.error('Error fetching top leaderboards:', error.message);
        }
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

    const filteredLeaders = rankedLeaders.filter(
        leader => leader.user_id?.username?.toLowerCase().includes(searchClassic)
    );

    const filteredLeadersMastery = rankedLeadersMastery.filter(
        leader => leader.user_id?.username?.toLowerCase().includes(searchMastery)
    );

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
                                value={searchClassic}
                                onChange={(e) => setSearchClassic(e.target.value.toLowerCase())}
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

                            {filteredLeaders.map((leader) => (
                                <div key={leader._id} className="leaders-container">
                                    <div className="leader-info text-black leaders-content-font">
                                    {leader.rank === 1 ? "🥇" : leader.rank === 2 ? "🥈" : leader.rank === 3 ? "🥉" : leader.rank}
                                    </div>
                                    <div className="leader-info text-black font-bold leaders-content-font">
                                    {leader.user_id?.username || "Unknown User"}
                                    </div>
                                    <div className="leader-info text-black leaders-content-font">{leader.category === "developmental" ? "Developmental Psychology" : 
                                                                                                  leader.category === "abnormal" ? "Abnormal Psychology" : 
                                                                                                  leader.category === "psychological" ? "Psychological Psychology":
                                                                                                  leader.category === "industrial" ? "Industrial Psychology":
                                                                                                  leader.category === "general" ? "General Psychology": leader.category}</div>
                                    <div className="leader-info text-black font-bold leaders-content-font">
                                    {leader.total_items > 0
                                        ? `${((leader.correct / leader.total_items) * 100).toFixed(0)}%` //rounds up para whole num
                                        : "N/A"}
                                    </div>
                                </div>
                            ))};


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
                                value={searchMastery}
                                onChange={(e) => setSearchMastery(e.target.value.toLowerCase())}
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


                            {filteredLeadersMastery.map((leader) => (
                                <div key={leader._id} className="leaders-container">
                                    <div className="leader-info text-black leaders-content-font">
                                    {leader.rank === 1 ? "🥇" : leader.rank === 2 ? "🥈" : leader.rank === 3 ? "🥉" : leader.rank}
                                    </div>
                                    <div className="leader-info text-black font-bold leaders-content-font">
                                    {leader.user_id?.username || "Unknown User"}
                                    </div>
                                    <div className="leader-info text-black leaders-content-font">{leader.category === "developmental" ? "Developmental Psychology" : 
                                                                                                  leader.category === "abnormal" ? "Abnormal Psychology" : 
                                                                                                  leader.category === "psychological" ? "Psychological Psychology":
                                                                                                  leader.category === "industrial" ? "Industrial Psychology":
                                                                                                  leader.category === "general" ? "General Psychology": leader.category}</div>
                                                                                                  
                                    <div className="leader-info text-black font-bold leaders-content-font">
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