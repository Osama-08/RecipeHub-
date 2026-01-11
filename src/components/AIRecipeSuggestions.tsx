"use client";

import React, { useState } from 'react';
import { Sparkles, Plus, X, Loader2, ChefHat, Clock, TrendingUp } from 'lucide-react';

interface RecipeSuggestion {
    name: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    cookingTime: number;
    ingredientsUsed: string[];
}

export default function AIRecipeSuggestions() {
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [currentIngredient, setCurrentIngredient] = useState('');
    const [suggestions, setSuggestions] = useState<RecipeSuggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const addIngredient = () => {
        if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
            setIngredients([...ingredients, currentIngredient.trim()]);
            setCurrentIngredient('');
        }
    };

    const removeIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const getSuggestions = async () => {
        if (ingredients.length === 0) {
            setError('Please add at least one ingredient');
            return;
        }

        setLoading(true);
        setError('');
        setSuggestions([]);

        try {
            const res = await fetch('/api/ai/recipe-suggestions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ingredients }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to get suggestions');
            }

            const data = await res.json();
            setSuggestions(data.recipes || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'text-green-600 bg-green-50';
            case 'Medium': return 'text-yellow-600 bg-yellow-50';
            case 'Hard': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl shadow-lg p-6 my-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-800">AI Recipe Suggestions</h3>
                    <p className="text-sm text-gray-600">Tell us what ingredients you have, we&apos;ll suggest recipes!</p>
                </div>
            </div>

            {/* Ingredient Input */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Add Your Ingredients</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={currentIngredient}
                        onChange={(e) => setCurrentIngredient(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                addIngredient();
                            }
                        }}
                        placeholder="e.g., chicken, rice, tomatoes"
                        className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                    />
                    <button
                        onClick={addIngredient}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add
                    </button>
                </div>
            </div>

            {/* Ingredient Tags */}
            {ingredients.length > 0 && (
                <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                        {ingredients.map((ingredient, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-orange-200 rounded-full text-sm font-medium text-gray-700"
                            >
                                {ingredient}
                                <button
                                    onClick={() => removeIngredient(index)}
                                    className="hover:text-red-500 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Get Suggestions Button */}
            <button
                onClick={getSuggestions}
                disabled={loading || ingredients.length === 0}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Getting AI Suggestions...
                    </>
                ) : (
                    <>
                        <Sparkles className="w-5 h-5" />
                        Get Recipe Suggestions
                    </>
                )}
            </button>

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-700 mb-4">
                    {error}
                </div>
            )}

            {/* Recipe Suggestions */}
            {suggestions.length > 0 && (
                <div className="space-y-4">
                    <h4 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                        <ChefHat className="w-5 h-5 text-orange-500" />
                        Suggested Recipes
                    </h4>
                    {suggestions.map((recipe, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow border-2 border-gray-100"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <h5 className="font-bold text-lg text-gray-800">{recipe.name}</h5>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(recipe.difficulty)}`}>
                                    {recipe.difficulty}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{recipe.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{recipe.cookingTime} mins</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>{recipe.ingredientsUsed.length} ingredients</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-700 mb-1">Uses from your list:</p>
                                <div className="flex flex-wrap gap-1">
                                    {recipe.ingredientsUsed.map((ing, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs"
                                        >
                                            {ing}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
