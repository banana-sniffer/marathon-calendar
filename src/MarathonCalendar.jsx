import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WORKOUTS, WEEKS, LONG_RUN_NUTRITION, TEMPO_MP_DAY_NUTRITION, EASY_DAY_NUTRITION, REST_DAY_NUTRITION } from './MarathonCalendarConstants';

const MarathonCalendar = () => {
    const [completedWorkouts, setCompletedWorkouts] = useState(new Set());

    const toggleWorkoutCompletion = (weekNum, day) => {
        const workoutKey = `${weekNum}-${day}`;
        setCompletedWorkouts(prev => {
            const newCompleted = new Set(prev);
            if (newCompleted.has(workoutKey)) {
                newCompleted.delete(workoutKey);
            } else {
                newCompleted.add(workoutKey);
            }
            return newCompleted;
        });
    };

    // Helper function to check if a card represents today
    const isCurrentDay = (weekData, dayName) => {
        const today = new Date();
        const startDate = new Date(today.getFullYear(), 0, 6); // Jan 6, 2025
        const weekStartDate = new Date(startDate);
        weekStartDate.setDate(startDate.getDate() + (weekData.weekNum - 1) * 7);
        
        const dayIndex = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(dayName);
        const cardDate = new Date(weekStartDate);
        cardDate.setDate(weekStartDate.getDate() + dayIndex);
        
        return today.toDateString() === cardDate.toDateString();
    };

    const getWorkoutColor = (workout) => {
        if (workout.includes('tempo') || workout.includes('5K pace')) return 'bg-red-100';
        if (workout.includes('MP')) return 'bg-yellow-100';
        if (workout.includes('long run') || workout.includes('RACE DAY')) return 'bg-blue-100';
        if (workout.includes('easy')) return 'bg-green-100';
        if (workout.includes('Rest')) return 'bg-gray-100';
        return 'bg-white';
    };

    const getWorkoutForDay = (weekNum, day) => {
        return WORKOUTS[weekNum]?.[day] || '';
    };

    const getNutritionGuidelines = (workout) => {
        if (workout.includes('long run') || workout.includes('RACE DAY')) {
            return LONG_RUN_NUTRITION
        }
        if (workout.includes('tempo') || workout.includes('MP')) {
            return TEMPO_MP_DAY_NUTRITION
        }
        if (workout.includes('easy')) {
            return EASY_DAY_NUTRITION
        }
        return REST_DAY_NUTRITION
    };

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Will's Marathon Training Plan</h1>
                <p className="text-gray-600">Goal: 3:25 Marathon (7:49 min/mile pace)</p>
                <p className="text-gray-600">Jan 6 - March 16, 2025</p>
            </div>

            <Tabs defaultValue="schedule" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="schedule">Training Schedule</TabsTrigger>
                    <TabsTrigger value="guidelines">Training Guidelines</TabsTrigger>
                </TabsList>

                <TabsContent value="guidelines">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="p-4">
                            <h3 className="font-bold mb-2">Pace Guidelines</h3>
                            <ul className="text-sm space-y-1">
                                <li>Easy/Recovery: 8:45-9:15/mile</li>
                                <li>Long Run Base: 8:30-9:00/mile</li>
                                <li>Marathon Pace (MP): 7:49/mile</li>
                                <li>Tempo Pace: 7:20-7:30/mile</li>
                                <li>5K Pace: 7:05-7:15/mile</li>
                            </ul>
                        </Card>

                        <Card className="p-4">
                            <h3 className="font-bold mb-2">Hydration Guidelines</h3>
                            <ul className="text-sm space-y-1">
                                <li>Daily baseline: 80-100 oz water</li>
                                <li>Add 16-20 oz per hour of running</li>
                                <li>Electrolytes for runs over 90 minutes</li>
                                <li>Monitor urine color (pale yellow ideal)</li>
                            </ul>
                        </Card>

                        <Card className="p-4">
                            <h3 className="font-bold mb-2">Color Code Key</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <p><span className="inline-block w-3 h-3 bg-red-100 mr-2"></span>Speed/Tempo</p>
                                <p><span className="inline-block w-3 h-3 bg-yellow-100 mr-2"></span>Marathon Pace</p>
                                <p><span className="inline-block w-3 h-3 bg-blue-100 mr-2"></span>Long Run</p>
                                <p><span className="inline-block w-3 h-3 bg-green-100 mr-2"></span>Easy/Recovery</p>
                                <p><span className="inline-block w-3 h-3 bg-gray-100 mr-2"></span>Rest/Cross-train</p>
                            </div>
                        </Card>

                        <Card className="p-4">
                            <h3 className="font-bold mb-2">Weekly Focus</h3>
                            <div className="text-sm space-y-2">
                                <p><strong>Week 1-4:</strong> Establish meal timing, practice pre-run fueling</p>
                                <p><strong>Week 5-7:</strong> Increase carbs for harder workouts, perfect race-day routine</p>
                                <p><strong>Week 8-9:</strong> Maintain high carbs, reduce fiber before long runs</p>
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="schedule">
                    <div className="grid grid-cols-1 gap-4">
                        {WEEKS.map((week) => (
                            <Card key={week.weekNum} className="p-4 shadow-md">
                                <h2 className="font-bold mb-2">
                                    Week {week.weekNum} ({week.start} - {week.end})
                                </h2>
                                <div className="grid grid-cols-7 gap-2">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                                        const workout = getWorkoutForDay(week.weekNum, day);
                                        const nutrition = getNutritionGuidelines(workout);
                                        const isCompleted = completedWorkouts.has(`${week.weekNum}-${day}`);
                                        const isToday = isCurrentDay(week, day);
                                        
                                        return (
                                            <div
                                                key={day}
                                                onClick={() => toggleWorkoutCompletion(week.weekNum, day)}
                                                className={`p-3 rounded-lg ${getWorkoutColor(workout)} min-h-24 
                                                    cursor-pointer relative overflow-hidden
                                                    transition-all duration-200 ease-in-out
                                                    border
                                                    ${isToday ? 
                                                        'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' : 
                                                        'border-gray-200 hover:border-gray-300'
                                                    }
                                                    ${isCompleted ? 
                                                        'opacity-60 transform scale-98 translate-y-0.5 shadow-inner' : 
                                                        'opacity-100 transform scale-100 translate-y-0 shadow-md hover:shadow-lg hover:-translate-y-1'
                                                    }
                                                    before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent`}
                                            >
                                                <div className="flex justify-between items-start mb-1 relative">
                                                    <p className={`font-semibold ${isToday ? 'text-blue-600' : ''}`}>
                                                        {day}
                                                        {isToday && <span className="ml-1 text-xs">(Today)</span>}
                                                    </p>
                                                    {isCompleted && (
                                                        <span className="text-green-600 text-sm font-bold">✓</span>
                                                    )}
                                                </div>
                                                <p className="text-sm mb-2 font-medium">{workout}</p>
                                                <div className="text-xs space-y-1 border-t border-gray-200/60 pt-1">
                                                    <p className="font-medium">{nutrition.title}</p>
                                                    {nutrition.preMeal && (
                                                        <p className="text-gray-600">{nutrition.preMeal}</p>
                                                    )}
                                                    {nutrition.preWorkout && (
                                                        <p className="text-gray-600">{nutrition.preWorkout}</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default MarathonCalendar;