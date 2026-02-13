import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Sun, Moon, Plus, Search, Filter, TrendingUp, 
  CheckCircle2, Circle, Edit2, Trash2, X, Calendar,
  Tag, Flag, Clock, BarChart3
} from 'lucide-react';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import './App.css';

// Theme Context
const ThemeContext = createContext();

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

// Generate unique IDs
const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

// Categories
const CATEGORIES = [
  { id: 'work', name: 'Work', color: '#3b82f6', icon: '💼' },
  { id: 'personal', name: 'Personal', color: '#8b5cf6', icon: '🏠' },
  { id: 'shopping', name: 'Shopping', color: '#ec4899', icon: '🛒' },
  { id: 'health', name: 'Health', color: '#10b981', icon: '💪' },
  { id: 'learning', name: 'Learning', color: '#f59e0b', icon: '📚' },
];

// Priority levels
const PRIORITIES = [
  { id: 'low', name: 'Low', color: '#6b7280' },
  { id: 'medium', name: 'Medium', color: '#f59e0b' },
  { id: 'high', name: 'High', color: '#ef4444' },
];

// Theme Provider Component
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    toast.success(theme === 'light' ? '🌙 Dark mode activated' : '☀️ Light mode activated', {
      duration: 2000,
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Header Component
const Header = ({ onStatsClick, showStats }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header 
      className="app-header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-content">
        <div className="header-left">
          <motion.div 
            className="logo"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <CheckCircle2 size={32} />
          </motion.div>
          <div className="header-text">
            <h1>TaskFlow</h1>
            <p>Your intelligent task companion</p>
          </div>
        </div>
        <div className="header-actions">
          <motion.button
            className="icon-btn"
            onClick={onStatsClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Statistics"
          >
            <BarChart3 size={20} />
          </motion.button>
          <motion.button
            className="icon-btn theme-toggle"
            onClick={toggleTheme}
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

// Search Bar Component
const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <motion.div 
      className="search-bar"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Search size={18} />
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      {searchTerm && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setSearchTerm('')}
          className="clear-search"
        >
          <X size={16} />
        </motion.button>
      )}
    </motion.div>
  );
};

// Todo Form Component
const TodoForm = ({ onAdd }) => {
  const [input, setInput] = useState('');
  const [category, setCategory] = useState('personal');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onAdd({
        text: input.trim(),
        category,
        priority,
        dueDate: dueDate || null,
      });
      setInput('');
      setDueDate('');
      setShowOptions(false);
      toast.success('✨ Task added successfully!');
    }
  };

  return (
    <motion.form 
      className="todo-form"
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="form-main">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
          className="todo-input"
          autoFocus
        />
        <motion.button
          type="button"
          className="options-toggle"
          onClick={() => setShowOptions(!showOptions)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Filter size={18} />
        </motion.button>
        <motion.button
          type="submit"
          className="add-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!input.trim()}
        >
          <Plus size={20} />
          Add
        </motion.button>
      </div>

      <AnimatePresence>
        {showOptions && (
          <motion.div
            className="form-options"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="option-group">
              <label><Tag size={14} /> Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="option-group">
              <label><Flag size={14} /> Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                {PRIORITIES.map(pri => (
                  <option key={pri.id} value={pri.id}>
                    {pri.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="option-group">
              <label><Calendar size={14} /> Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
};

// Todo Item Component
const TodoItem = ({ todo, onToggle, onDelete, onEdit, index }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const category = CATEGORIES.find(c => c.id === todo.category);
  const priority = PRIORITIES.find(p => p.id === todo.priority);

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(todo.id, editText.trim());
      setIsEditing(false);
      toast.success('📝 Task updated');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  const getDueDateStatus = () => {
    if (!todo.dueDate) return null;
    const date = new Date(todo.dueDate);
    if (isPast(date) && !isToday(date)) return 'overdue';
    if (isToday(date)) return 'today';
    if (isTomorrow(date)) return 'tomorrow';
    return 'upcoming';
  };

  const dueDateStatus = getDueDateStatus();

  return (
    <motion.li
      className={`todo-item ${todo.completed ? 'completed' : ''} priority-${todo.priority}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05 }}
      layout
    >
      <div className="todo-main">
        <motion.button
          className="checkbox"
          onClick={() => onToggle(todo.id)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {todo.completed ? (
            <CheckCircle2 size={22} className="checked" />
          ) : (
            <Circle size={22} />
          )}
        </motion.button>

        <div className="todo-content">
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              className="todo-edit-input"
              autoFocus
            />
          ) : (
            <>
              <span className="todo-text">{todo.text}</span>
              <div className="todo-meta">
                <span 
                  className="category-badge" 
                  style={{ backgroundColor: category.color }}
                >
                  {category.icon} {category.name}
                </span>
                {todo.dueDate && (
                  <span className={`due-date ${dueDateStatus}`}>
                    <Clock size={12} />
                    {dueDateStatus === 'overdue' && 'Overdue'}
                    {dueDateStatus === 'today' && 'Today'}
                    {dueDateStatus === 'tomorrow' && 'Tomorrow'}
                    {dueDateStatus === 'upcoming' && format(new Date(todo.dueDate), 'MMM d')}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="todo-actions">
        {!isEditing && (
          <>
            <motion.button
              onClick={() => setIsEditing(true)}
              className="action-btn edit"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Edit2 size={16} />
            </motion.button>
            <motion.button
              onClick={() => {
                onDelete(todo.id);
                toast.success('🗑️ Task deleted');
              }}
              className="action-btn delete"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Trash2 size={16} />
            </motion.button>
          </>
        )}
      </div>
    </motion.li>
  );
};

// Filters Component
const Filters = ({ filter, setFilter, itemsLeft, onClearCompleted, hasCompleted, categoryFilter, setCategoryFilter }) => {
  return (
    <motion.div 
      className="filters-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="filter-row">
        <span className="items-count">
          <TrendingUp size={16} />
          {itemsLeft} active {itemsLeft === 1 ? 'task' : 'tasks'}
        </span>

        <div className="filter-buttons">
          {['all', 'active', 'completed'].map((f) => (
            <motion.button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </motion.button>
          ))}
        </div>

        {hasCompleted && (
          <motion.button
            className="clear-completed"
            onClick={() => {
              onClearCompleted();
              toast.success('✨ Completed tasks cleared');
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Clear Completed
          </motion.button>
        )}
      </div>

      <div className="category-filters">
        <motion.button
          className={`category-filter ${!categoryFilter ? 'active' : ''}`}
          onClick={() => setCategoryFilter(null)}
          whileHover={{ scale: 1.05 }}
        >
          All Categories
        </motion.button>
        {CATEGORIES.map(cat => (
          <motion.button
            key={cat.id}
            className={`category-filter ${categoryFilter === cat.id ? 'active' : ''}`}
            onClick={() => setCategoryFilter(cat.id)}
            style={{ 
              '--category-color': cat.color,
              backgroundColor: categoryFilter === cat.id ? cat.color : 'transparent',
              color: categoryFilter === cat.id ? 'white' : 'inherit',
            }}
            whileHover={{ scale: 1.05 }}
          >
            {cat.icon} {cat.name}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// Statistics Component
const Statistics = ({ todos, onClose }) => {
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const active = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const categoryCounts = CATEGORIES.map(cat => ({
    ...cat,
    count: todos.filter(t => t.category === cat.id).length,
  }));

  const overdue = todos.filter(t => 
    !t.completed && t.dueDate && isPast(new Date(t.dueDate)) && !isToday(new Date(t.dueDate))
  ).length;

  return (
    <motion.div
      className="stats-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="stats-modal"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="stats-header">
          <h2>📊 Your Statistics</h2>
          <button onClick={onClose} className="close-btn">
            <X size={24} />
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{total}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{completed}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{active}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{completionRate}%</div>
            <div className="stat-label">Completion Rate</div>
          </div>
        </div>

        {overdue > 0 && (
          <div className="overdue-alert">
            ⚠️ You have {overdue} overdue {overdue === 1 ? 'task' : 'tasks'}
          </div>
        )}

        <div className="category-stats">
          <h3>Tasks by Category</h3>
          {categoryCounts.map(cat => (
            <div key={cat.id} className="category-stat">
              <span style={{ color: cat.color }}>
                {cat.icon} {cat.name}
              </span>
              <span className="category-count">{cat.count}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Empty State Component
const EmptyState = ({ filter }) => {
  const messages = {
    all: { emoji: '🎯', text: 'No tasks yet. Start by adding one above!' },
    active: { emoji: '✨', text: 'All done! No active tasks.' },
    completed: { emoji: '📝', text: 'No completed tasks yet. Keep going!' },
  };

  const message = messages[filter] || messages.all;

  return (
    <motion.div
      className="empty-state"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <motion.div 
        className="empty-icon"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1
        }}
      >
        {message.emoji}
      </motion.div>
      <p>{message.text}</p>
    </motion.div>
  );
};

// Main App Component
function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showStats, setShowStats] = useState(false);

  // Load todos from localStorage
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos-v2');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage
  useEffect(() => {
    localStorage.setItem('todos-v2', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (todoData) => {
    const newTodo = {
      id: generateId(),
      ...todoData,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleTodo = (id) => {
    setTodos(todos.map((todo) => {
      if (todo.id === id) {
        const newCompleted = !todo.completed;
        if (newCompleted) {
          toast.success('🎉 Task completed!', {
            icon: '✅',
            duration: 2000,
          });
        }
        return { ...todo, completed: newCompleted };
      }
      return todo;
    }));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const editTodo = (id, newText) => {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  // Filter todos
  let filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  // Filter by category
  if (categoryFilter) {
    filteredTodos = filteredTodos.filter(todo => todo.category === categoryFilter);
  }

  // Filter by search
  if (searchTerm) {
    filteredTodos = filteredTodos.filter(todo =>
      todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const itemsLeft = todos.filter((todo) => !todo.completed).length;
  const hasCompleted = todos.some((todo) => todo.completed);

  return (
    <ThemeProvider>
      <div className="app">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--toast-bg)',
              color: 'var(--toast-color)',
              border: '1px solid var(--border)',
            },
          }}
        />

        <div className="todo-container">
          <Header onStatsClick={() => setShowStats(true)} showStats={showStats} />
          
          <div className="todo-body">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <TodoForm onAdd={addTodo} />

            <AnimatePresence mode="wait">
              {filteredTodos.length === 0 ? (
                <EmptyState key="empty" filter={filter} />
              ) : (
                <motion.ul 
                  className="todo-list"
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <AnimatePresence>
                    {filteredTodos.map((todo, index) => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        index={index}
                        onToggle={toggleTodo}
                        onDelete={deleteTodo}
                        onEdit={editTodo}
                      />
                    ))}
                  </AnimatePresence>
                </motion.ul>
              )}
            </AnimatePresence>

            {todos.length > 0 && (
              <Filters
                filter={filter}
                setFilter={setFilter}
                itemsLeft={itemsLeft}
                onClearCompleted={clearCompleted}
                hasCompleted={hasCompleted}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
              />
            )}
          </div>
        </div>

        <AnimatePresence>
          {showStats && (
            <Statistics todos={todos} onClose={() => setShowStats(false)} />
          )}
        </AnimatePresence>
      </div>
    </ThemeProvider>
  );
}

export default App;