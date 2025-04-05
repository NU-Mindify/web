import '../../css/leaderboards.css'
import search from '../../assets/search.svg'
import mockleaders from '../../data/MockLeaderboards.json'

export default function Leaderboard(){
    return(
        <>
            <div className='leaderboard-body'>

                <div className='classic-cont'>

                    <div className='leaderboard-titles-cont'>
                        <h1 className='leaderboard-title'>Classic</h1>
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
                        <div>
                            {mockleaders.map((leaders, element) => (
                                <div key={element}>
                                    <h1>{leaders.rank} {leaders.name} {leaders.world} {leaders.score}</h1>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className='mastery-cont'>
                    <div className='leaderboard-titles-cont'>
                        <h1 className='leaderboard-title'>Mastery</h1>
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
                        <div>
                            {mockleaders.map((leaders, element) => (
                                <div key={element}>
                                    <h1>{leaders.rank} {leaders.world} {leaders.score}</h1>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}