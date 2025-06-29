import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth.jsx'
import { supabase } from '../../lib/supabase'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiTarget, FiPlus, FiCheck, FiX, FiEdit3, FiCalendar } = FiIcons

const GoalTracker = () => {
  const { user } = useAuth()
  const [goals, setGoals] = useState([])
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'career',
    target_date: '',
    priority: 'medium'
  })
  const [loading, setLoading] = useState(true)

  const categories = [
    { value: 'career', label: 'Career', color: 'bg-blue-100 text-blue-800' },
    { value: 'business', label: 'Business', color: 'bg-purple-100 text-purple-800' },
    { value: 'financial', label: 'Financial', color: 'bg-green-100 text-green-800' },
    { value: 'personal', label: 'Personal', color: 'bg-orange-100 text-orange-800' }
  ]

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' }
  ]

  useEffect(() => {
    if (user) {
      fetchGoals()
    }
  }, [user])

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setGoals(data || [])
    } catch (error) {
      console.error('Error fetching goals:', error)
    } finally {
      setLoading(false)
    }
  }

  const addGoal = async () => {
    if (!newGoal.title.trim()) return

    try {
      const { data, error } = await supabase
        .from('user_goals')
        .insert({
          user_id: user.id,
          ...newGoal,
          status: 'active'
        })

      if (error) throw error

      setNewGoal({
        title: '',
        description: '',
        category: 'career',
        target_date: '',
        priority: 'medium'
      })
      setShowAddGoal(false)
      fetchGoals()
    } catch (error) {
      console.error('Error adding goal:', error)
    }
  }

  const toggleGoalStatus = async (goalId, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'active' : 'completed'
    
    try {
      const { error } = await supabase
        .from('user_goals')
        .update({ 
          status: newStatus,
          completed_at: newStatus === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', goalId)

      if (error) throw error

      // Award achievement for first completed goal
      if (newStatus === 'completed') {
        const completedGoals = goals.filter(g => g.status === 'completed').length
        if (completedGoals === 0) {
          await supabase
            .from('achievements')
            .insert({
              user_id: user.id,
              title: 'Goal Achiever',
              description: 'Completed your first goal!',
              earned_at: new Date().toISOString()
            })
        }
      }

      fetchGoals()
    } catch (error) {
      console.error('Error updating goal:', error)
    }
  }

  const deleteGoal = async (goalId) => {
    try {
      const { error } = await supabase
        .from('user_goals')
        .delete()
        .eq('id', goalId)

      if (error) throw error
      fetchGoals()
    } catch (error) {
      console.error('Error deleting goal:', error)
    }
  }

  const getCategoryInfo = (category) => {
    return categories.find(c => c.value === category) || categories[0]
  }

  const getPriorityInfo = (priority) => {
    return priorities.find(p => p.value === priority) || priorities[1]
  }

  if (!user || loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <SafeIcon icon={FiTarget} className="mr-2 text-green-600" />
          Goal Tracker
        </h3>
        <button
          onClick={() => setShowAddGoal(true)}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <SafeIcon icon={FiPlus} />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Add Goal Form */}
      <AnimatePresence>
        {showAddGoal && (
          <motion.div
            className="mb-6 p-4 bg-gray-50 rounded-xl"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="font-semibold text-gray-900 mb-4">Add New Goal</h4>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Goal title..."
                value={newGoal.title}
                onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              
              <textarea
                placeholder="Goal description..."
                value={newGoal.description}
                onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              
              <div className="grid grid-cols-3 gap-4">
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                
                <select
                  value={newGoal.priority}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, priority: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
                
                <input
                  type="date"
                  value={newGoal.target_date}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, target_date: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={addGoal}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Goal
                </button>
                <button
                  onClick={() => setShowAddGoal(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goals List */}
      {goals.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <SafeIcon icon={FiTarget} className="text-4xl mx-auto mb-4 text-gray-300" />
          <p>No goals set yet. Add your first goal to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal, index) => {
            const categoryInfo = getCategoryInfo(goal.category)
            const priorityInfo = getPriorityInfo(goal.priority)
            const isCompleted = goal.status === 'completed'
            const isOverdue = goal.target_date && new Date(goal.target_date) < new Date() && !isCompleted

            return (
              <motion.div
                key={goal.id}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  isCompleted 
                    ? 'border-green-200 bg-green-50' 
                    : isOverdue 
                      ? 'border-red-200 bg-red-50' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <button
                        onClick={() => toggleGoalStatus(goal.id, goal.status)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isCompleted
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-green-500'
                        }`}
                      >
                        {isCompleted && <SafeIcon icon={FiCheck} className="text-sm" />}
                      </button>
                      
                      <h4 className={`font-semibold ${isCompleted ? 'text-green-900 line-through' : 'text-gray-900'}`}>
                        {goal.title}
                      </h4>
                      
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                        {categoryInfo.label}
                      </span>
                      
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityInfo.color}`}>
                        {priorityInfo.label}
                      </span>
                    </div>
                    
                    {goal.description && (
                      <p className={`text-sm mb-2 ${isCompleted ? 'text-green-700' : 'text-gray-600'}`}>
                        {goal.description}
                      </p>
                    )}
                    
                    {goal.target_date && (
                      <div className={`flex items-center space-x-1 text-xs ${
                        isOverdue ? 'text-red-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        <SafeIcon icon={FiCalendar} />
                        <span>Target: {new Date(goal.target_date).toLocaleDateString()}</span>
                        {isOverdue && <span className="font-semibold">(Overdue)</span>}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <SafeIcon icon={FiX} />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Goal Stats */}
      {goals.length > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {goals.filter(g => g.status === 'completed').length}
              </div>
              <div className="text-sm text-green-700">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {goals.filter(g => g.status === 'active').length}
              </div>
              <div className="text-sm text-blue-700">Active</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {goals.filter(g => g.target_date && new Date(g.target_date) < new Date() && g.status !== 'completed').length}
              </div>
              <div className="text-sm text-orange-700">Overdue</div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default GoalTracker