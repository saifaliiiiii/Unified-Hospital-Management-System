import { useEffect, useMemo, useState } from 'react'
import { Sparkles } from 'lucide-react'
import Feed from '../components/curanex/Feed'
import RightPanel from '../components/curanex/RightPanel'
import Sidebar from '../components/curanex/Sidebar'

const STORAGE_KEY = 'curanex-posts'
const THEME_KEY = 'curanex-theme'

const initialPosts = [
  {
    id: 'seed-1',
    author: 'Dr. Meera Anand',
    role: 'Doctor',
    verified: true,
    avatar: 'MA',
    timestamp: '2026-04-01T08:30:00+05:30',
    content:
      'Today we used a rapid stroke-response workflow that reduced treatment time by 14 minutes. Small coordination wins make a huge difference in emergency care.',
    image: '',
    likes: 48,
    liked: false,
    shares: 12,
    bookmarked: false,
    comments: [
      {
        id: 'c-1',
        author: 'Nurse Isha',
        text: 'Love seeing operational learnings shared this way.',
      },
    ],
  },
  {
    id: 'seed-2',
    author: 'Arjun Kapoor',
    role: 'Patient',
    verified: false,
    avatar: 'AK',
    timestamp: '2026-04-01T10:15:00+05:30',
    content:
      'Six weeks into cardiac rehab and I finally completed a full morning walk without stopping. Posting this for anyone who feels recovery is taking too long.',
    image: '',
    likes: 31,
    liked: true,
    shares: 6,
    bookmarked: true,
    comments: [
      {
        id: 'c-2',
        author: 'Dr. Meera Anand',
        text: 'That is meaningful progress. Keep pacing yourself and stay consistent.',
      },
    ],
  },
  {
    id: 'seed-3',
    author: 'CuraNex Awareness Desk',
    role: 'Awareness',
    verified: false,
    avatar: 'CA',
    timestamp: '2026-04-01T11:45:00+05:30',
    content:
      'Heat alerts are rising this week. Stay hydrated, avoid direct sunlight during peak afternoon hours, and watch for dizziness, dehydration, or unusual fatigue.',
    image: '',
    likes: 72,
    liked: false,
    shares: 29,
    bookmarked: false,
    comments: [],
  },
]

const trendingTopics = [
  { tag: '#MentalHealth', posts: '1.2K' },
  { tag: '#EmergencyCare', posts: '860' },
  { tag: '#COVIDRecovery', posts: '740' },
  { tag: '#RuralHealth', posts: '520' },
]

const suggestedUsers = [
  { name: 'Dr. Rhea Singh', role: 'Cardiologist', avatar: 'RS' },
  { name: 'Kabir Malhotra', role: 'Patient Advocate', avatar: 'KM' },
  { name: 'Dr. Vani Bedi', role: 'Pediatrician', avatar: 'VB' },
]

export default function CuraNex() {
  const [posts, setPosts] = useState(initialPosts)
  const [composerText, setComposerText] = useState('')
  const [composerImage, setComposerImage] = useState('')
  const [selectedRole, setSelectedRole] = useState('Doctor')
  const [filterValue, setFilterValue] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const storedPosts = localStorage.getItem(STORAGE_KEY)
    const storedTheme = localStorage.getItem(THEME_KEY)

    if (storedPosts) {
      setPosts(JSON.parse(storedPosts))
    }

    if (storedTheme) {
      setDarkMode(storedTheme === 'dark')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
  }, [posts])

  useEffect(() => {
    localStorage.setItem(THEME_KEY, darkMode ? 'dark' : 'light')
  }, [darkMode])

  const filteredPosts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return posts.filter((post) => {
      const matchesFilter = filterValue === 'All' || post.role === filterValue
      const haystack = [post.author, post.role, post.content]
        .join(' ')
        .toLowerCase()
      const matchesSearch = !normalizedQuery || haystack.includes(normalizedQuery)

      return matchesFilter && matchesSearch
    })
  }, [filterValue, posts, searchQuery])

  const handleCreatePost = () => {
    const trimmedText = composerText.trim()
    if (!trimmedText) {
      return
    }

    const author =
      selectedRole === 'Doctor'
        ? 'Dr. Punjab Community'
        : selectedRole === 'Patient'
          ? 'Punjab Patient Voice'
          : 'CuraNex Awareness Desk'
    const avatar =
      selectedRole === 'Doctor'
        ? 'DP'
        : selectedRole === 'Patient'
          ? 'PV'
          : 'CA'

    const nextPost = {
      id: `post-${Date.now()}`,
      author,
      role: selectedRole,
      verified: selectedRole === 'Doctor',
      avatar,
      timestamp: new Date().toISOString(),
      content: trimmedText,
      image: composerImage,
      likes: 0,
      liked: false,
      shares: 0,
      bookmarked: false,
      comments: [],
    }

    setPosts((current) => [nextPost, ...current])
    setComposerText('')
    setComposerImage('')
    setFilterValue('All')
  }

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setComposerImage(reader.result)
      }
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const updatePost = (postId, updater) => {
    setPosts((current) =>
      current.map((post) => (post.id === postId ? updater(post) : post)),
    )
  }

  return (
    <div
      className={[
        'min-h-screen pb-14 pt-16 transition-colors',
        darkMode
          ? 'bg-[linear-gradient(180deg,#020617_0%,#0f172a_100%)] text-slate-100'
          : 'bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.18),_transparent_28%),linear-gradient(180deg,#f8fbff_0%,#eef7ff_45%,#f8fafc_100%)] text-slate-900',
      ].join(' ')}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <section
          className={[
            'overflow-hidden rounded-[32px] border px-6 py-8 shadow-[0_28px_80px_rgba(15,23,42,0.12)] sm:px-8',
            darkMode
              ? 'border-slate-800 bg-slate-950/80'
              : 'border-white/80 bg-white/80',
          ].join(' ')}
        >
          <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700 shadow-sm">
                <Sparkles className="h-4 w-4" />
                CuraNex Medical Community
              </div>
              <h1
                className={[
                  'mt-5 text-4xl font-semibold tracking-tight sm:text-5xl',
                  darkMode ? 'text-white' : 'text-slate-950',
                ].join(' ')}
              >
                Twitter-style healthcare conversations built for doctors and
                patients.
              </h1>
              <p
                className={[
                  'mt-4 max-w-2xl text-base leading-7',
                  darkMode ? 'text-slate-300' : 'text-slate-600',
                ].join(' ')}
              >
                Share case learnings, health journeys, emergency reflections,
                and awareness tips in one responsive medical community feed with
                comments, likes, bookmarks, and trending topics.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              {[
                { label: 'Live posts', value: posts.length },
                { label: 'Trending topics', value: trendingTopics.length },
                { label: 'Suggested users', value: suggestedUsers.length },
              ].map((item) => (
                <div
                  key={item.label}
                  className={[
                    'rounded-[24px] border p-4 shadow-sm',
                    darkMode
                      ? 'border-slate-800 bg-slate-900/80'
                      : 'border-sky-100 bg-white/80',
                  ].join(' ')}
                >
                  <p
                    className={
                      darkMode
                        ? 'text-xs font-semibold uppercase tracking-[0.18em] text-slate-400'
                        : 'text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'
                    }
                  >
                    {item.label}
                  </p>
                  <p
                    className={[
                      'mt-2 text-3xl font-semibold',
                      darkMode ? 'text-white' : 'text-slate-950',
                    ].join(' ')}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)_320px]">
          <Sidebar
            darkMode={darkMode}
            onToggleTheme={() => setDarkMode((value) => !value)}
          />

          <Feed
            darkMode={darkMode}
            composerText={composerText}
            onComposerTextChange={setComposerText}
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
            composerImage={composerImage}
            onImageUpload={handleImageUpload}
            onCreatePost={handleCreatePost}
            filterValue={filterValue}
            onFilterChange={setFilterValue}
            filteredPosts={filteredPosts}
            onToggleLike={(postId) =>
              updatePost(postId, (post) => ({
                ...post,
                liked: !post.liked,
                likes: post.liked ? post.likes - 1 : post.likes + 1,
              }))
            }
            onToggleBookmark={(postId) =>
              updatePost(postId, (post) => ({
                ...post,
                bookmarked: !post.bookmarked,
              }))
            }
            onShare={(postId) =>
              updatePost(postId, (post) => ({
                ...post,
                shares: post.shares + 1,
              }))
            }
            onAddComment={(postId, commentText) =>
              updatePost(postId, (post) => ({
                ...post,
                comments: [
                  ...post.comments,
                  {
                    id: `comment-${Date.now()}`,
                    author: 'CuraNex Member',
                    text: commentText,
                  },
                ],
              }))
            }
          />

          <RightPanel
            darkMode={darkMode}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            trendingTopics={trendingTopics}
            suggestedUsers={suggestedUsers}
          />
        </section>
      </div>
    </div>
  )
}
