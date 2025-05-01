import '../../css/analytics/analytics.css'
import axios from 'axios'
import { API_URL, categories, modes, levels } from '../../Constants'
import { useEffect, useState } from 'react'

export default function Analytics(){

    const [attempts, setAttempts] = useState([]);
    const [perfectCount, setPerfectCount] = useState(0);

    useEffect(()=>{
        fetchAttempts();
    }, []);

    const fetchAttempts = async () => {
        try {
            const categoryList = categories.map(c => c.category).join(',');
            const levelList = levels.join(','); 
            const modeList = modes.map(m => m.mode).join(',');
            
            const response = await axios.get(`${API_URL}/getTopLeaderboards`, {
              params: {
                categories: categoryList,
                levels: levelList,
                mode: modeList
              }
            });
        
            console.log(response.data); 
            setAttempts(response.data);
          } catch (error) {
            console.error('Error fetching top leaderboards:', error.message);
          }
    };

    //to calculate perfect scores after attempts is updated
    useEffect(() => {
        const perfects = attempts.filter(
            user => user.correct === user.total_items && user.total_items > 0
        );
        setPerfectCount(perfects.length);
    }, [attempts]);
            
    
    //counts how many got perfect then converts to percentage
    const perfectPercent = attempts.length > 0
    ? ((perfectCount / attempts.length) * 100).toFixed(0) + "%" //para whole num
    : 0;
    
    //abnormal cat attempts
    const abnormalAttempts = attempts.filter(attempt => attempt.category === "abnormal");

    //calculates correct % for abnormal cat
    const abnormalCorrectPercent = abnormalAttempts.length > 0
    ? (
        abnormalAttempts.reduce((acc, curr) => {
            //sum of all correct scores + sum of all total items
            const percent = (curr.correct / curr.total_items) * 100;
            return acc + percent;
        }, 0) / abnormalAttempts.length
        ).toFixed(0) +"%"
    : 0;


    //developmental cat attempts
    const developmentalAttempts = attempts.filter(attempt => attempt.category === "developmental");

    //calculates correct % for developmental cat
    const developmentalCorrectPercent = developmentalAttempts.length > 0
    ? (
        developmentalAttempts.reduce((acc, curr) => {
            //sum of all correct scores + sum of all total items
            const percent = (curr.correct / curr.total_items) * 100;
            return acc + percent;
        }, 0) / developmentalAttempts.length
        ).toFixed(0) +"%"
    : 0;

    //psycho cat attempts
    const psychologicalAttempts = attempts.filter(attempt => attempt.category === "psychological");

    //calculates correct % for psycho cat
    const psychologicalCorrectPercent = psychologicalAttempts.length > 0
    ? (
        psychologicalAttempts.reduce((acc, curr) => {
            const percent = (curr.correct / curr.total_items) * 100;
            return acc + percent;
        }, 0) / psychologicalAttempts.length
        ).toFixed(0) +"%"
    : 0;

    //indus/org cat attempts
    const industrialAttempts = attempts.filter(attempt => attempt.category === "industrial");

    //calculates correct % for indus cat
    const industrialCorrectPercent = industrialAttempts.length > 0
    ? (
        industrialAttempts.reduce((acc, curr) => {
            const percent = (curr.correct / curr.total_items) * 100;
            return acc + percent;
        }, 0) / industrialAttempts.length
        ).toFixed(0) +"%"
    : 0;

    //general psych cat attempts
    const generalAttempts = attempts.filter(attempt => attempt.category === "general");

    //calculates correct % for general psych cat
    const generalCorrectPercent = generalAttempts.length > 0
    ? (
        generalAttempts.reduce((acc, curr) => {
            const percent = (curr.correct / curr.total_items) * 100;
            return acc + percent;
        }, 0) / generalAttempts.length
        ).toFixed(0) +"%"
    : 0;

    return(
        <>
            <div className='main-container-analytics'>

                <div className='header-container-analytics'>
                    <h1 className='header-text-properties-analytics'>Analytics</h1>
                </div>


                <div className='content-container-analytics'>

                    <div className='analytics-container-properties'>
                    {/* GENERAL ANALYTICS  */}
                        <h1 className='analytics-title-text-properties'>General Analytics</h1>
                        <div className='progress-bar-container'>
                            <p className='text-black font-bold'>Overall Attempts</p>
                            <progress value={attempts.length} max={100}  className='analytics-progress-bar progress-yellow' />
                            <label className='text-black'>{attempts.length}</label>
                        </div>

                        <div className='progress-bar-container'>
    
                            {/* idk what this should calculate */}
                            <p className='text-black font-bold'>Completion Rate</p>
                            <progress value={0} max={100}  className='analytics-progress-bar progress-yellow' />
                            <label className='text-black'>n/a</label>
                        </div>

                        <div className='progress-bar-container'>
                            <p className='text-black font-bold'>Perfect %</p>
                            <progress value={parseInt(perfectPercent)} max={100}  className='analytics-progress-bar progress-yellow' />
                            <label className='text-black'>{perfectPercent}</label>
                        </div>
                        
                    </div> 

                    {/* ABNORMAL PSYCH ANALYTICS */}
                    <div className='analytics-container-properties'>
                        <h1 className='analytics-title-text-properties'>Abnormal Psychology Analytics</h1>
                        <div className='progress-bar-container'>
                            <p className='text-black font-bold'>Total Attempts</p>
                            <progress value={abnormalAttempts.length} max={100}  className='analytics-progress-bar progress-yellow' />
                            <label className='text-black'>{abnormalAttempts.length}</label>
                        </div>

                        <div className='progress-bar-container'>
                            <p className='text-black font-bold'>Correct %</p>
                            <progress value={parseInt(abnormalCorrectPercent)} max={100}  className='analytics-progress-bar progress-yellow' />
                            <label className='text-black'>{abnormalCorrectPercent}</label>
                        </div>

                        <div className='progress-bar-container'>
                            <p className='text-black font-bold'>Mastery %</p>
                            <progress value={0} max={100}  className='analytics-progress-bar progress-yellow' />
                            <label className='text-black'>n/a</label>
                        </div>
                    </div>

                    {/* DEVELOPMENTAL PSYCH ANALYTICS */}
                    <div className='analytics-container-properties'>
                        <h1 className='analytics-title-text-properties'>Developmental Psychology Analytics</h1>
                        <div className='progress-bar-container'>
                            <p className='text-black font-bold'>Total Attempts</p>
                            <progress value={developmentalAttempts.length} max={100}  className='analytics-progress-bar progress-yellow' />
                            <label className='text-black'>{developmentalAttempts.length}</label>
                        </div>

                        <div className='progress-bar-container'>
                            <p className='text-black font-bold'>Correct %</p>
                            <progress value={parseInt(developmentalCorrectPercent)} max={100}  className='analytics-progress-bar progress-yellow' />
                            <label className='text-black'>{developmentalCorrectPercent}</label>
                        </div>

                        <div className='progress-bar-container'>
                            <p className='text-black font-bold'>Mastery %</p>
                            <progress value={0} max={100}  className='analytics-progress-bar progress-yellow' />
                            <label className='text-black'>n/a</label>
                        </div>
                    </div>

                    {/* PSYCHO PSYCH ANALYTICS */}
                    <div className='analytics-container-properties'>
                        <h1 className='analytics-title-text-properties'>Psychological Assessment Analytics</h1>
                        <div className='progress-bar-container'>
                            <p className='text-black font-bold'>Total Attempts</p>
                            <progress value={psychologicalAttempts.length} max={100}  className='analytics-progress-bar progress-yellow' />
                            <label className='text-black'>{psychologicalAttempts.length}</label>
                        </div>

                        <div className='progress-bar-container'>
                            <p className='text-black font-bold'>Correct %</p>
                            <progress value={parseInt(psychologicalCorrectPercent)} max={100}  className='analytics-progress-bar progress-yellow' />
                            <label className='text-black'>{psychologicalCorrectPercent}</label>
                        </div>

                        <div className='progress-bar-container'>
                            <p className='text-black font-bold'>Mastery %</p>
                            <progress value={0} max={100}  className='analytics-progress-bar progress-yellow' />
                            <label className='text-black'>n/a</label>
                        </div>
                    </div>

                    {/* INDUSTRIAL PSYCH ANALYTICS */}
                    <div className='analytics-container-properties'>
                        <h1 className='analytics-title-text-properties'>Industrial/Organizational Analytics</h1>
                        <div className='progress-bar-container'>
                            <p className='text-black font-bold'>Total Attempts</p>
                            <progress value={industrialAttempts.length} max={100}  className='analytics-progress-bar progress-yellow' />
                            <label className='text-black'>{industrialAttempts.length}</label>
                        </div>

                        <div className='progress-bar-container'>
                            <p className='text-black font-bold'>Correct %</p>
                            <progress value={parseInt(industrialCorrectPercent)} max={100}  className='analytics-progress-bar progress-yellow' />
                            <label className='text-black'>{industrialCorrectPercent}</label>
                        </div>

                        <div className='progress-bar-container'>
                            <p className='text-black font-bold'>Mastery %</p>
                            <progress value={0} max={100}  className='analytics-progress-bar progress-yellow' />
                            <label className='text-black'>n/a</label>
                        </div>
                    </div>

                    {/* GENERAL PSYCH ANALYTICS */}
                    <div className='analytics-container-properties'>
                        <h1 className='analytics-title-text-properties'>General Psychology Analytics</h1>
                        <div className='progress-bar-container'>
                            <p className='text-black font-bold'>Total Attempts</p>
                            <progress value={generalAttempts.length} max={100}  className='analytics-progress-bar progress-yellow' />
                            <label className='text-black'>{generalAttempts.length}</label>
                        </div>

                        <div className='progress-bar-container'>
                            <p className='text-black font-bold'>Correct %</p>
                            <progress value={parseInt(generalCorrectPercent)} max={100}  className='analytics-progress-bar progress-yellow' />
                            <label className='text-black'>{generalCorrectPercent}</label>
                        </div>

                        <div className='progress-bar-container'>
                            <p className='text-black font-bold'>Mastery %</p>
                            <progress value={0} max={100}  className='analytics-progress-bar progress-yellow' />
                            <label className='text-black'>n/a</label>
                        </div>
                    </div>
                </div>
            </div>
            
        </>
    )
}