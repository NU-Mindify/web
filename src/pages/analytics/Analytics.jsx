import '../../css/analytics/analytics.css'
import axios from 'axios'
import { API_URL, categories, modes, levels } from '../../Constants'
import { useEffect, useState } from 'react'
import AnimatedProgressBar from '../../components/animatedProgressBar/AnimatedProgressBar'

export default function Analytics(){

    //notes and possible changes for analytics
    
    //Should change progress bars as if the number reaches 100 the progress bar would be full and therefore be meaningless
    
    //Other possible analytics we could display
    //Average Score of all users
    //Most Challenging Topic - Topic with the lowest average score
    //Most Attempted Topic - topic with the highest average score
    //Return % - percentage at which how many users return/continue to use the app
    //Average Session Duration - average time spent per session
    //Highest Streak Leader - lists students with the longest streak
    //Daily login streak - lists students who logged in the app for consecutive days


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
            
            const response = await axios.get(`${API_URL}/getAnalytics`, {
              params: {
                categories: categoryList,
                levels: levelList,
                mode: modeList
              }
            });
        
            console.log(response.data); 
            setAttempts(response.data);
          } catch (error) {
            console.error('Error fetching analytics data:', error.message);
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

                    {/* GENERAL ANALYTICS  */}
                    <div className='analytics-container-properties'>
                        <h1 className='analytics-title-text-properties'>General Analytics</h1>
                        
                        <div className="progress-bar-container">
                        <p className="text-black font-bold">Total Attempts</p>
                            <div className="flex items-center gap-2 w-[95%]">
                                <div className="flex-1 bg-gray-300 rounded-full h-5 overflow-hidden">
                                <div
                                    className="h-full bg-[#FFBF1A] transition-all duration-700 ease-in-out"
                                    style={{ width: `${Math.min(attempts.length, 100)}%` }}
                                ></div>
                                </div>
                                <span className="text-black font-bold min-w-[40px] text-right">{attempts.length}</span>
                            </div>
                        </div>

                        
                        <AnimatedProgressBar
                            label="Completion Rate"
                            percent={0}
                            color="bg-[#FFBF1A]"
                        />

                        <AnimatedProgressBar
                            label="Perfect %"
                            percent={parseInt(perfectPercent)}
                            color="bg-[#FFBF1A]"
                        />
                    </div> 

                    {/* ABNORMAL PSYCH ANALYTICS */}
                    <div className='analytics-container-properties'>
                        <h1 className='analytics-title-text-properties'>Abnormal Psychology Analytics</h1>
                        
                        <div className="progress-bar-container">
                        <p className="text-black font-bold">Total Attempts</p>
                            <div className="flex items-center gap-2 w-[95%]">
                                <div className="flex-1 bg-gray-300 rounded-full h-5 overflow-hidden">
                                <div
                                    className="h-full bg-[#FFBF1A] transition-all duration-700 ease-in-out"
                                    style={{ width: `${Math.min(abnormalAttempts.length, 100)}%` }}
                                ></div>
                                </div>
                                <span className="text-black font-bold min-w-[40px] text-right">{abnormalAttempts.length}</span>
                            </div>
                        </div>

                        
                        <AnimatedProgressBar
                            label="Correct %"
                            percent={parseInt(abnormalCorrectPercent)}
                            color="bg-[#FFBF1A]"
                        />
                        
                        <AnimatedProgressBar
                            label="Mastery %"
                            percent={0}
                            color="bg-[#FFBF1A]"
                        />
                    </div> 


                    {/* DEVELOPMENTAL PSYCH ANALYTICS */}
                    <div className='analytics-container-properties'>
                        <h1 className='analytics-title-text-properties'>Developmental Psychology Analytics</h1>
                        
                        <div className="progress-bar-container">
                        <p className="text-black font-bold">Total Attempts</p>
                            <div className="flex items-center gap-2 w-[95%]">
                                <div className="flex-1 bg-gray-300 rounded-full h-5 overflow-hidden">
                                <div
                                    className="h-full bg-[#FFBF1A] transition-all duration-700 ease-in-out"
                                    style={{ width: `${Math.min(developmentalAttempts.length, 100)}%` }}
                                ></div>
                                </div>
                                <span className="text-black font-bold min-w-[40px] text-right">{developmentalAttempts.length}</span>
                            </div>
                        </div>

                        
                        <AnimatedProgressBar
                            label="Correct %"
                            percent={parseInt(developmentalCorrectPercent)}
                            color="bg-[#FFBF1A]"
                        />
                        
                        <AnimatedProgressBar
                            label="Mastery %"
                            percent={0}
                            color="bg-[#FFBF1A]"
                        />
                    </div> 

                    {/* PSYCHO PSYCH ANALYTICS */}
                    <div className='analytics-container-properties'>
                        <h1 className='analytics-title-text-properties'>Psychological Psychology Analytics</h1>
                        
                        <div className="progress-bar-container">
                        <p className="text-black font-bold">Total Attempts</p>
                            <div className="flex items-center gap-2 w-[95%]">
                                <div className="flex-1 bg-gray-300 rounded-full h-5 overflow-hidden">
                                <div
                                    className="h-full bg-[#FFBF1A] transition-all duration-700 ease-in-out"
                                    style={{ width: `${Math.min(psychologicalAttempts.length, 100)}%` }}
                                ></div>
                                </div>
                                <span className="text-black font-bold min-w-[40px] text-right">{psychologicalAttempts.length}</span>
                            </div>
                        </div>

                        
                        <AnimatedProgressBar
                            label="Correct %"
                            percent={parseInt(psychologicalCorrectPercent)}
                            color="bg-[#FFBF1A]"
                        />
                        
                        <AnimatedProgressBar
                            label="Mastery %"
                            percent={0}
                            color="bg-[#FFBF1A]"
                        />
                    </div> 

                    {/* INDUSTRIAL PSYCH ANALYTICS */}
                    <div className='analytics-container-properties'>
                        <h1 className='analytics-title-text-properties'>Industrial/Organizational Psychology Analytics</h1>
                        
                        <div className="progress-bar-container">
                        <p className="text-black font-bold">Total Attempts</p>
                            <div className="flex items-center gap-2 w-[95%]">
                                <div className="flex-1 bg-gray-300 rounded-full h-5 overflow-hidden">
                                <div
                                    className="h-full bg-[#FFBF1A] transition-all duration-700 ease-in-out"
                                    style={{ width: `${Math.min(industrialAttempts.length, 100)}%` }}
                                ></div>
                                </div>
                                <span className="text-black font-bold min-w-[40px] text-right">{industrialAttempts.length}</span>
                            </div>
                        </div>

                        
                        <AnimatedProgressBar
                            label="Correct %"
                            percent={parseInt(industrialCorrectPercent)}
                            color="bg-[#FFBF1A]"
                        />
                        
                        <AnimatedProgressBar
                            label="Mastery %"
                            percent={0}
                            color="bg-[#FFBF1A]"
                        />
                    </div> 

                    {/* GENERAL PSYCH ANALYTICS */}
                    <div className='analytics-container-properties'>
                        <h1 className='analytics-title-text-properties'>General Psychology Analytics</h1>
                        
                        <div className="progress-bar-container">
                        <p className="text-black font-bold">Total Attempts</p>
                            <div className="flex items-center gap-2 w-[95%]">
                                <div className="flex-1 bg-gray-300 rounded-full h-5 overflow-hidden">
                                <div
                                    className="h-full bg-[#FFBF1A] transition-all duration-700 ease-in-out"
                                    style={{ width: `${Math.min(generalAttempts.length, 100)}%` }}
                                ></div>
                                </div>
                                <span className="text-black font-bold min-w-[40px] text-right">{generalAttempts.length}</span>
                            </div>
                        </div>

                        
                        <AnimatedProgressBar
                            label="Correct %"
                            percent={parseInt(generalCorrectPercent)}
                            color="bg-[#FFBF1A]"
                        />
                        
                        <AnimatedProgressBar
                            label="Mastery %"
                            percent={0}
                            color="bg-[#FFBF1A]"
                        />
                    </div> 
                </div>
            </div>
            
        </>
    )
}