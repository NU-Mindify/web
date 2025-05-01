import '../../css/leaderboard/leaderboards.css'
import search from '../../assets/search/search.svg'
import mockleaders from '../../data//staticData/MockLeaderboards.json'

export default function Leaderboard(){
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
                            {mockleaders.map((leaders, element) => (
                                <div key={element} className='leaders-container'>
                                    <h1 className='leader-info'>
                                        {leaders.rank == 1 ? "🥇" : leaders.rank == 2 ? "🥈" : leaders.rank == 3 ? "🥉" : leaders.rank}
                                    </h1>
                                    <h1 className='leader-info text-blue-500 font-bold'>{leaders.name}</h1>
                                    <h1 className='leader-info'>{leaders.world}</h1>
                                    <h1 className='leader-info font-bold'>{leaders.score}</h1>
                                </div>
<<<<<<< Updated upstream
                            ))}
=======
                                <div className="leader-info font-bold" style={{ color: '#0068DD' }}>
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


>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                            {mockleaders.map((leaders, element) => (
                                <div key={element} className='leaders-container'>
                                    <h1 className='leader-info'>
                                    {leaders.rank == 1 ? "🥇" : leaders.rank == 2 ? "🥈" : leaders.rank == 3 ? "🥉" : leaders.rank}
                                    </h1>
                                    <h1 className='leader-info text-blue-500 font-bold'>{leaders.name}</h1>
                                    <h1 className='leader-info'>{leaders.world}</h1>
                                    <h1 className='leader-info font-bold'>{leaders.score}</h1>
=======


                            {rankedLeadersMastery.map((leader) => (
                                <div key={leader._id} className="leaders-container">
                                    <div className="leader-info text-black">
                                    {leader.rank === 1 ? "🥇" : leader.rank === 2 ? "🥈" : leader.rank === 3 ? "🥉" : leader.rank}
                                    </div>
                                    <div className="leader-info font-bold" style={{ color: '#0068DD' }}>
                                    {leader.user_id?.username || "Unknown User"}
                                    </div>
                                    <div className="leader-info text-black">{leader.category}</div>
                                    <div className="leader-info text-black font-bold">
                                    {leader.total_items > 0
                                        ? `${((leader.correct / leader.total_items) * 100).toFixed(0)}%`
                                        : "N/A"}
                                    </div>
>>>>>>> Stashed changes
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}