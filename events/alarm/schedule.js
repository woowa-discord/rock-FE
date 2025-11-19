import { scheduleJob } from 'node-schedule';
import { client } from '../../index.js';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from 'discord.js';
import { ATTENDANCE } from '../../constants/messages.js';
import pool from '../../db/database.js';
import { SCHEDULE_QUERIES } from '../../db/queries/schedule.js';

export const scheduleManager = {
  // 길드별 스케쥴 저장(map으로)
  scheduledJobs: new Map(),

  // 단일 서버 출석 스케줄 설정
  async setupAttendance(guildId) {
    try {
      // 기존 스케쥴 데이터 있으면 취소(어차피 재설정)
      if (this.scheduledJobs.has(guildId)) {
        this.scheduledJobs.get(guildId).cancel();
        console.log(`기존 스케줄 취소됨`);
      }

      // time은 node-schedule 형식대로 넣어둠
      const timeSetting = await pool.query(SCHEDULE_QUERIES.GET_TIME, [
        guildId,
      ]);
      if (timeSetting.rows.length === 0) {
        console.log('설정이 없습니다.');
        return;
      }

      // 설정 가져와서 스케쥴링
      const { attendance_channel_id, attendance_time } = timeSetting.rows[0];
      const job = scheduleJob(attendance_time, async () => {
        const channel = client.channels.cache.get(attendance_channel_id);

        if (!channel) {
          console.error(ATTENDANCE.NO_CHANNEL);
          return;
        }

        // 기존 내용과 동일
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('출석')
            .setLabel('출석')
            .setStyle(ButtonStyle.Primary)
        );
        const embed = new EmbedBuilder()
          .setTitle('출석 체크')
          .setDescription(ATTENDANCE.BUTTON_MESSAGE);

        await channel.send({ embeds: [embed], components: [row] });
        console.log('출석 버튼 전송 완료');
      });

      // 서버 스케쥴 정보 저장
      this.scheduledJobs.set(guildId, job);
    } catch (error) {
      console.error('스케쥴 설정 오류', error);
    }
  },

  // 모든 서버 스케줄 초기화
  async initializeAllSchedules() {
    try {
      const result = await pool.query(SCHEDULE_QUERIES.GET_ID);

      // 모든 서버 setup
      for (const row of result.rows) {
        await this.setupAttendance(row.guild_id);
      }
    } catch (error) {
      console.error('스케쥴 초기화 오류', error);
    }
  },

  // index.js ClientReady용
  async loadSchedules(guildId) {
    if (guildId) {
      await this.setupAttendance(guildId);
    } else {
      await this.initializeAllSchedules();
    }
  },
};
