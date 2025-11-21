import { useEffect, useRef, useState } from 'react';
import AttendanceCalendar from './components/AttendanceCalendar';
import './components/calendar.css';
import GuildDropdown from './components/GuildDropdown';
import Header from './components/Header';
import { PersonalStatsCard } from './components/PersonalStatsCard';
import { RankingCard } from './components/RankingCard';
import { DISCORD_LOGIN_URL } from './constants/constant.js';
import { supabase } from "./database/supabaseClient.js";

export default function App() {
  const guildId = '1435586389243854860';
  const userId = '391098361924812800';
  const userName = '유저이름';

  //localStorage에 access token 여부로 로그인 여부 확인
  const [loginState, setLoginState] = useState(() => !!localStorage.getItem('discord_access_token'));
  
  //로그인 버튼 클릭 시 디스코드 로그인하는 화면으로 이동
  const handleDiscordLogin = () =>{
    console.log('디스코드 로그인 실행')
    window.location.href = DISCORD_LOGIN_URL;
  }
  
  //로그아웃 버튼 클릭시 logainState false 및 localStorage에 저장된 access_token 삭제
  const handleDiscordLogout= () => {
    setLoginState(false);
    localStorage.removeItem('discord_access_token');
    console.log("로그아웃");
  }

  const hasRequestedAccessToken = useRef(false); // 이미 요청했는지 체크
  useEffect(() => {
    const handleLogin = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    //url에 code가 있고 아직 supabase에 요청을 안 했을 때만 실행
    if ( code && !hasRequestedAccessToken.current) {
      hasRequestedAccessToken.current = true;
      const { data, error } = await supabase.functions.invoke("discord-oauth", {
        body: { code },
      });

      if (error) {
        console.error("에러 발생:", error);
        alert("로그인에 실패했습니다");
        // 에러가 나면 code는 사용하지 못하기 때문에 삭제
        window.history.replaceState({}, document.title, "/"); 
      } else {
        console.log("로그인 성공!");
        
        localStorage.setItem('discord_access_token', data.access_token);
        setLoginState(true);

        // 페이지를 새로고침 하지 않고 url에 code만 지운 상태로 변경 
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };
  };

  handleLogin();

}, []); 

  // mock 데이터
  const personalStats = { attendanceCount: 3, streakDays: 2, studyTotal: 45 };
  const rankingData = [
    { username: '여빈', hours: 45 },
    { username: '희주', hours: 38 },
    { username: '돌쇠', hours: 32 },
    { username: '이슬', hours: 30 },
  ];


  return (
    <>
      <Header isLoggedIn={loginState} onLogin={handleDiscordLogin} onLogout={handleDiscordLogout} />

      <main className="px-4 pt-[120px] pb-6 md:px-8 lg:px-40">
        {/* 유저네임 + 드롭다운 */}
        <div className="flex justify-between items-center mb-4">
          {/* 왼쪽: 유저네임 */}
          <span className="text-black text-xl font-semibold">
            {userName}님의 Dashboard
          </span>

          {/* 오른쪽: Guild Dropdown */}
          <GuildDropdown />
        </div>

        <AttendanceCalendar guildId={guildId} userId={userId} />

        <div className="flex justify-center gap-12 flex-wrap text-black mt-6">
          <PersonalStatsCard {...personalStats} />
          <RankingCard ranking={rankingData} />
        </div>
      </main>
    </>
  );
}
