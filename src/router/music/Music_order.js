import React from 'react'
import { DataContext } from '../../contexts/mainContext'
import { MUSIC_MOUNT, SET_MUSIC_SEARCH_RESULTS} from '../../actions/music_action'
import MusicList from '../../components/MusicList'

import { Toolbar, CircularProgress } from '@material-ui/core';

import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';

import SearchIcon from '@material-ui/icons/Search';
import { MusicNote, Album, Person } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    backgroundColor: '#3f51b5',
    // display: 'flex',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '100px',
      '&:focus': {
        width: '220px',
      },
    },
  }
}));


export default function Music () {
  const classes = useStyles();
  const [{music_player, music_search_results}, dispatch] = React.useContext(DataContext)

  const [searchValue, setSearchValue] = React.useState('')
  const [inputFocus, setInputFocus] = React.useState(false)
  const [searching, setSearching] = React.useState(false)
  
  const blurDebouncer = React.useRef(null)


  

  // http://api.qq.jsososo.com/search/quick 

  const onSearchInputChange = e => {
    const keyword = e.target.value
    setSearchValue(keyword)
  }



  const onSearch = async e => {
    e.preventDefault()
    console.log(searchValue)

    setInputFocus(false)
    if (!searchValue) return

    setSearching(true)
    try {
      const res = await fetch(`http://localhost:3300/search?key=${searchValue}`)
      const json = await res.json()
      console.log(json)
      if (json.result === 100 && json.data.list.length > 0) {
        const songs = json.data.list
        const list = songs.map(song => {
          return {
            songid: song.songid,
            songname: song.songname,
            songmid: song.songmid,
            artists: song.singer,
            albumname: song.albumname,
            albummid: song.albummid,
            duration: song.interval,
            vip: !song.pay.payplay
          }
        })
        
        dispatch({type: SET_MUSIC_SEARCH_RESULTS, payload: list})
      } else {
        console.warn('internet connection error!')
      }
    }catch(e) {
      console.warn('internet connection error!')
    }
    setSearching(false)
  }

  const onQuickSearchClick = async (data) => {
    clearTimeout(blurDebouncer.current)
    setInputFocus(false)
    // console.log(data)

    const url = `http://localhost:3300/song/urls?id=${data.mid}` // 003cI52o4daJJL

    try {
      // const getCookie = await fetch('http://localhost:3300/user/cookie')
      // const cookieJson = await getCookie.json()
      // console.log(cookieJson)

      // fetch song detail info for getting album cover image
      const getSongInfo = await fetch(`http://localhost:3300/song?songmid=${data.mid}`)
      const songJson = await getSongInfo.json()
      // console.log(songJson)

      // fetch for song play url, data: {'mid': url}
      const response = await fetch(url)
      const result = await response.json()
      // console.log(result)

      if (result.result !== 100) return console.warn('can not get song url.')
      dispatch({type: MUSIC_MOUNT, payload: {...data, url: result.data[data.mid], detail: songJson.data}})

      music_player.load(result.data[data.mid])

    } catch (e) {
      console.log('Can not get song URL!', e)
    }
  }

  const onInputFocus = () => {
    setInputFocus(true)
    clearTimeout(blurDebouncer.current)
  }

  const onInputBlur = () => {
    blurDebouncer.current = setTimeout(() => {
      if (inputFocus) setInputFocus(false)
    }, 200)
  }



  
  return (
    <div className="music-section-main">
      
      <Toolbar className={classes.root}>
        <form onSubmit={onSearch}>
          <div className={classes.search}>
            
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              value={searchValue}
              onChange={onSearchInputChange}
              placeholder="搜索"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              onFocus={onInputFocus}
              onBlur={onInputBlur}
            />
        </div>            
      </form>
      {searchValue && inputFocus && <SearchResults keyword={searchValue} onQuickSearchClick={onQuickSearchClick}/>}
      </Toolbar>

      <div className="music-order-main">
        <div className="search-results">
          {searching?<CircularProgress className="search-results-loading"/>:<MusicList results={music_search_results}/>}
        </div>
        <div className="current-playlist">
              
        </div>
      </div>
    </div>
  )
}

/**
 * <Popover
                className={classes.popover}
                classes={{
                  paper: classes.paper,
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
              >
 * 
 */

const order = ['song', 'singer', 'album']

function SearchResults ({keyword, onQuickSearchClick}) {

  const searchDebouncer = React.useRef(null)
  const [quickData, setQuickData] = React.useState({})
  
  // const url = `http://localhost:3300/search?pageNo=1&pageSize=3&key=${keyword}`
  const url = `http://localhost:3300/search/quick?key=${keyword}`
  

  React.useEffect(() => {
    clearTimeout(searchDebouncer.current)
    const controller = new AbortController()
    const signal = controller.signal;

    const cacheKeyword = localStorage.getItem('keyword')

    searchDebouncer.current = setTimeout(async () => {
      console.log('start fetching...')
      console.log({url})

      try {
        const response = await fetch(url, {signal})
        const results = await response.json()
        console.log(results)

        setQuickData(results.data || {})
        // cache results
        localStorage.setItem('keyword', keyword)
        localStorage.setItem('data', JSON.stringify(results.data))

      }catch(err) {
        console.log({err})
      }
    }, 1000)


    if (cacheKeyword && cacheKeyword === keyword) {
      const cacheData = localStorage.getItem('data')
      if (cacheData) {
        console.log('read data from cache!')
        setQuickData(JSON.parse(cacheData))
        clearTimeout(searchDebouncer.current)
      }
    }
    

    return function clearup () {
      // console.log('clearup')
      clearTimeout(searchDebouncer.current)
      controller.abort()
    }
  }, [keyword, url])

  return (
    <div className="quick-search-results">
      {order.map(key => quickData[key] && quickData[key].count > 0 && <ResultList {...quickData[key]} key={quickData[key].order} onQuickSearchClick={onQuickSearchClick}/>)}
    </div>
  )
}


function ResultList ({count, itemlist, name, type, onQuickSearchClick}) {
  // console.log({name, count, itemlist, type})

  return (
    <ul>
      <i><SearchResultIcon type={type}/><span>{name} {count}</span></i>
      {itemlist.map(item => <ListItem item={item} type={type} key={item.id} onQuickSearchClick={onQuickSearchClick}/>)}
    </ul>
  )
}

function ListItem ({item, type, onQuickSearchClick}) {

  const handleSearch = () => {
    console.log('Click event:', {item, type})
    onQuickSearchClick(item)
  }

  return (
    <li onClick={handleSearch}>{item.name} - {item.singer}</li>
  )
}


function SearchResultIcon({type}) {
  switch (type) {
    case 1:
      return <MusicNote fontSize="small"/>
    case 2:
      return <Person fontSize="small"/>
    case 3:
      return <Album fontSize="small"/>
    default:
      return <MusicNote fontSize="small"/>
  }
}