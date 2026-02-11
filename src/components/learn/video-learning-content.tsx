'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    BookOpen as BookOpenIcon,
    MagnifyingGlass as MagnifyingGlassIcon,
    Funnel as FunnelIcon,
    PlayCircle as PlayCircleIcon,
    Clock as ClockIcon,
    GraduationCap as AcademicCapIcon
} from '@phosphor-icons/react';
import { Badge } from '@/components/ui/badge';

interface Video {
    id: string;
    title: string;
    description: string;
    url: string;
    duration: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    topics: string[];
}

export function VideoLearningContent() {
    const t = useTranslations('learn');
    const [videos, setVideos] = useState<Video[]>([]);
    const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
    const [selectedLevel, setSelectedLevel] = useState<string>('all');
    const [selectedTopic, setSelectedTopic] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

    // Charger les vidéos
    useEffect(() => {
        fetch('/data/video-catalog.json')
            .then(res => res.json())
            .then(data => {
                setVideos(data.videos);
                setFilteredVideos(data.videos);
            })
            .catch(err => console.error('Error loading videos:', err));
    }, []);

    // Filtrer les vidéos
    useEffect(() => {
        let filtered = [...videos];

        // Filtre par niveau
        if (selectedLevel !== 'all') {
            filtered = filtered.filter(v => v.level === selectedLevel);
        }

        // Filtre par sujet
        if (selectedTopic !== 'all') {
            filtered = filtered.filter(v =>
                v.topics.some(topic => topic.toLowerCase().includes(selectedTopic.toLowerCase()))
            );
        }

        // Recherche
        if (searchQuery) {
            filtered = filtered.filter(v =>
                v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                v.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredVideos(filtered);
    }, [videos, selectedLevel, selectedTopic, searchQuery]);

    // Extraire tous les sujets uniques
    const allTopics = Array.from(new Set(videos.flatMap(v => v.topics)));

    // Extraire l'ID de la vidéo YouTube
    const getYouTubeId = (url: string) => {
        const match = url.match(/[?&]v=([^&]+)/);
        return match ? match[1] : null;
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* En-tête */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <AcademicCapIcon className="w-10 h-10 text-blue-400" />
                    <h1 className="text-4xl font-bold text-white">
                        {t('title')}
                    </h1>
                </div>
                <p className="text-slate-400 text-lg">
                    {t('subtitle')}
                </p>
            </div>

            {/* Barre de recherche et filtres */}
            <div className="mb-8 space-y-4">
                {/* Recherche */}
                <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                        type="text"
                        placeholder={t('search')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-500"
                    />
                </div>

                {/* Filtres */}
                <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                        <FunnelIcon className="w-5 h-5 text-slate-400" />
                        <span className="text-sm text-slate-400">{t('filters.title')}:</span>
                    </div>

                    {/* Filtre par niveau */}
                    <select
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        className="px-4 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">{t('filters.allLevels')}</option>
                        <option value="beginner">{t('filters.beginner')}</option>
                        <option value="intermediate">{t('filters.intermediate')}</option>
                    </select>

                    {/* Filtre par sujet */}
                    <select
                        value={selectedTopic}
                        onChange={(e) => setSelectedTopic(e.target.value)}
                        className="px-4 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">{t('filters.allTopics')}</option>
                        {allTopics.map(topic => (
                            <option key={topic} value={topic}>
                                {topic.charAt(0).toUpperCase() + topic.slice(1)}
                            </option>
                        ))}
                    </select>

                    {/* Bouton reset */}
                    {(selectedLevel !== 'all' || selectedTopic !== 'all' || searchQuery) && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setSelectedLevel('all');
                                setSelectedTopic('all');
                                setSearchQuery('');
                            }}
                            className="border-slate-700 text-slate-300 hover:bg-slate-800"
                        >
                            {t('filters.reset')}
                        </Button>
                    )}
                </div>
            </div>

            {/* Compteur de résultats */}
            <div className="mb-6">
                <p className="text-sm text-slate-400">
                    {filteredVideos.length} {t('results', { count: filteredVideos.length })}
                </p>
            </div>

            {/* Lecteur vidéo sélectionnée */}
            {selectedVideo && (
                <div className="mb-8 bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-6">
                    <div className="aspect-video mb-4">
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${getYouTubeId(selectedVideo.url)}`}
                            title={selectedVideo.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded-lg"
                        />
                    </div>
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                {selectedVideo.title}
                            </h3>
                            <p className="text-slate-400">
                                {selectedVideo.description}
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedVideo(null)}
                            className="text-slate-400 hover:text-white"
                        >
                            ✕
                        </Button>
                    </div>
                </div>
            )}

            {/* Liste des vidéos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video) => (
                    <div
                        key={video.id}
                        onClick={() => setSelectedVideo(video)}
                        className="bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-800/50 overflow-hidden hover:border-slate-700 transition-all duration-300 cursor-pointer group"
                    >
                        {/* Miniature YouTube */}
                        <div className="relative aspect-video bg-slate-800">
                            <img
                                src={`https://img.youtube.com/vi/${getYouTubeId(video.url)}/maxresdefault.jpg`}
                                alt={video.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    // Fallback si maxres n'existe pas
                                    e.currentTarget.src = `https://img.youtube.com/vi/${getYouTubeId(video.url)}/hqdefault.jpg`;
                                }}
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
                                <PlayCircleIcon className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                            </div>
                            <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 rounded text-xs text-white flex items-center gap-1">
                                <ClockIcon className="w-3 h-3" />
                                {video.duration}
                            </div>
                        </div>

                        {/* Contenu */}
                        <div className="p-5">
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                                    {video.title}
                                </h3>
                            </div>

                            <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                                {video.description}
                            </p>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-2">
                                {/* Badge niveau */}
                                <Badge
                                    variant={video.level === 'beginner' ? 'default' : 'secondary'}
                                    className={`text-xs ${
                                        video.level === 'beginner'
                                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                            : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                    }`}
                                >
                                    {video.level === 'beginner' ? t('filters.beginner') : t('filters.intermediate')}
                                </Badge>

                                {/* Badge premier sujet */}
                                {video.topics[0] && (
                                    <Badge
                                        variant="outline"
                                        className="text-xs bg-slate-800/50 text-slate-300 border-slate-700"
                                    >
                                        {video.topics[0]}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Message si aucun résultat */}
            {filteredVideos.length === 0 && (
                <div className="text-center py-16">
                    <BookOpenIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-400 mb-2">
                        {t('noResults.title')}
                    </h3>
                    <p className="text-slate-500">
                        {t('noResults.message')}
                    </p>
                </div>
            )}
        </div>
    );
}
