// Internationalization (i18n) for Thai and English

const translations = {
  th: {
    // Navigation
    nav: {
      vote: 'โหวต',
      results: 'ผลการโหวต',
      luckyDraw: '🎲 จับฉลาก',
      import: 'Config'
    },
    // Voting Page
    voting: {
      title: 'โหวต MVP',
      description: 'ระบบโหวต MVP ของ Benefit-One\n\nคำแนะนำในการโหวต:\n• คุณสามารถแจกคะแนนได้สูงสุด 100 คะแนนต่อคน\n• คะแนนจะถูกแจกให้กับสมาชิกที่คุณต้องการโหวต\n• คุณสามารถให้คะแนนหลายคนได้ แต่รวมกันต้องไม่เกิน 100 คะแนน\n• คะแนนที่ให้จะสะท้อนถึงความเห็นของคุณต่อการเป็น MVP\n\nกรุณาใช้วิจารณญาณในการให้คะแนนอย่างเป็นธรรม',
      showInstructions: 'แสดงคำแนะนำ',
      voterName: 'ชื่อผู้โหวต',
      voterNamePlaceholder: 'กรอกชื่อของคุณ',
      distributePoints: 'แจกคะแนน (สูงสุด 100 คะแนน)',
      pointsUsed: 'คะแนนที่ใช้',
      remaining: 'เหลือ',
      points: 'คะแนน',
      submit: 'ส่งการโหวต',
      success: 'บันทึกการโหวตสำเร็จแล้ว!',
      noMembers: 'ยังไม่มีรายชื่อสมาชิก',
      goToImport: 'ไปที่หน้า Import รายชื่อ →',
      alertVoterName: 'กรุณากรอกชื่อผู้โหวต',
      alertNoScore: 'กรุณาให้คะแนนอย่างน้อย 1 คน'
    },
    // Results Page
    results: {
      title: 'Leadership Board',
      subtitle: 'ผลการโหวต MVP ประจำปี',
      totalVoters: 'จำนวนผู้โหวตทั้งหมด',
      people: 'คน',
      congratulations: 'ยินดีด้วยกับผู้ชนะ!',
      winnerMessage: 'ผู้ที่ได้รับคะแนนสูงสุดจะได้รับรางวัล MVP',
      totalScore: 'คะแนนรวม',
      average: 'เฉลี่ย',
      perPerson: 'คะแนน/คน',
      ofTotal: 'ของคะแนนทั้งหมด',
      refresh: 'รีเฟรชผลการโหวต',
      noResults: 'ยังไม่มีผลการโหวต',
      voteFirst: 'กรุณาโหวตก่อนเพื่อดูผลลัพธ์'
    },
    // Import Page
    import: {
      title: 'Import รายชื่อสมาชิก',
      subtitle: 'จัดการรายชื่อสมาชิกสำหรับการโหวต MVP',
      addMember: 'เพิ่มสมาชิกใหม่',
      memberName: 'ชื่อสมาชิก',
      photo: 'รูปภาพ (ไม่บังคับ)',
      photoPreview: 'ตัวอย่างรูปภาพ',
      add: 'เพิ่มสมาชิก',
      importCSV: 'Import จากไฟล์ CSV',
      csvDescription: 'รูปแบบไฟล์: ไฟล์ CSV ที่มีคอลัมน์ชื่อ "name" หรือรายชื่อทีละบรรทัด',
      allMembers: 'รายชื่อสมาชิกทั้งหมด',
      people: 'คน',
      noMembers: 'ยังไม่มีรายชื่อสมาชิก',
      startAdding: 'เริ่มต้นโดยการเพิ่มสมาชิกใหม่',
      edit: 'แก้ไข',
      delete: 'ลบ',
      save: 'บันทึก',
      cancel: 'ยกเลิก',
      deleteConfirm: 'คุณต้องการลบสมาชิกคนนี้หรือไม่?',
      importSuccess: 'นำเข้าสำเร็จ',
      alertMemberName: 'กรุณากรอกชื่อสมาชิก',
      resetVotes: 'รีเซ็ตการโหวต',
      resetVotesConfirm: 'คุณต้องการรีเซ็ตการโหวตทั้งหมดหรือไม่?\nการกระทำนี้ไม่สามารถย้อนกลับได้!',
      resetVotesSuccess: 'รีเซ็ตการโหวตสำเร็จแล้ว',
      totalVotes: 'จำนวนการโหวตทั้งหมด'
    },
    // Password Protection
    password: {
      title: 'กรุณากรอกรหัสผ่าน',
      description: 'หน้านี้ต้องการการยืนยันตัวตน',
      password: 'รหัสผ่าน',
      passwordPlaceholder: 'กรอกรหัสผ่าน',
      submit: 'เข้าสู่ระบบ',
      error: 'รหัสผ่านไม่ถูกต้อง'
    },
    // Lucky Draw Page
    luckyDraw: {
      title: 'จับฉลาก',
      subtitle: 'จับฉลากเลือกผู้โชคดีจากรายชื่อสมาชิก',
      totalMembers: 'จำนวนสมาชิกทั้งหมด',
      startDraw: 'เริ่มจับฉลาก',
      drawing: 'กำลังจับฉลาก...',
      currentSelection: 'ผู้ที่ถูกเลือก',
      winner: 'ผู้ชนะ',
      congratulations: 'ยินดีด้วย!',
      drawAgain: 'จับอีกครั้ง',
      reset: 'รีเซ็ต',
      allMembers: 'รายชื่อสมาชิกทั้งหมด',
      noMembers: 'ยังไม่มีรายชื่อสมาชิก',
      goToConfig: 'ไปที่หน้า Config เพื่อเพิ่มสมาชิก'
    }
  },
  en: {
    // Navigation
    nav: {
      vote: 'Vote',
      results: 'Results',
      luckyDraw: '🎲 Lucky Draw',
      import: 'Config'
    },
    // Voting Page
    voting: {
      title: 'Vote MVP',
      description: 'Benefit-One MVP Voting System\n\nVoting Instructions:\n• You can distribute a maximum of 100 points per person\n• Points will be distributed to members you want to vote for\n• You can give points to multiple people, but the total must not exceed 100 points\n• The points you give will reflect your opinion on who should be MVP\n\nPlease use your judgment to give points fairly',
      showInstructions: 'Show Instructions',
      voterName: 'Voter Name',
      voterNamePlaceholder: 'Enter your name',
      distributePoints: 'Distribute Points (Maximum 100 points)',
      pointsUsed: 'Points Used',
      remaining: 'Remaining',
      points: 'points',
      submit: 'Submit Vote',
      success: 'Vote saved successfully!',
      noMembers: 'No members available',
      goToImport: 'Go to Import Members →',
      alertVoterName: 'Please enter voter name',
      alertNoScore: 'Please give points to at least 1 person'
    },
    // Results Page
    results: {
      title: 'Leadership Board',
      subtitle: 'MVP Voting Results for the Year',
      totalVoters: 'Total Voters',
      people: 'people',
      congratulations: 'Congratulations to the Winners!',
      winnerMessage: 'The person with the highest score will receive the MVP award',
      totalScore: 'Total Score',
      average: 'Average',
      perPerson: 'points/person',
      ofTotal: 'of Total Score',
      refresh: 'Refresh Results',
      noResults: 'No voting results yet',
      voteFirst: 'Please vote first to see results'
    },
    // Import Page
    import: {
      title: 'Import Members',
      subtitle: 'Manage member list for MVP voting',
      addMember: 'Add New Member',
      memberName: 'Member Name',
      photo: 'Photo (Optional)',
      photoPreview: 'Photo Preview',
      add: 'Add Member',
      importCSV: 'Import from CSV File',
      csvDescription: 'File format: CSV file with "name" column or one name per line',
      allMembers: 'All Members',
      people: 'people',
      noMembers: 'No members yet',
      startAdding: 'Start by adding a new member',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      deleteConfirm: 'Do you want to delete this member?',
      importSuccess: 'Successfully imported',
      alertMemberName: 'Please enter member name',
      resetVotes: 'Reset Votes',
      resetVotesConfirm: 'Do you want to reset all votes?\nThis action cannot be undone!',
      resetVotesSuccess: 'Votes reset successfully',
      totalVotes: 'Total Votes'
    },
    // Password Protection
    password: {
      title: 'Please Enter Password',
      description: 'This page requires authentication',
      password: 'Password',
      passwordPlaceholder: 'Enter password',
      submit: 'Login',
      error: 'Incorrect password'
    },
    // Lucky Draw Page
    luckyDraw: {
      title: 'Lucky Draw',
      subtitle: 'Randomly select a lucky winner from member list',
      totalMembers: 'Total Members',
      startDraw: 'Start Draw',
      drawing: 'Drawing...',
      currentSelection: 'Current Selection',
      winner: 'Winner',
      congratulations: 'Congratulations!',
      drawAgain: 'Draw Again',
      reset: 'Reset',
      allMembers: 'All Members',
      noMembers: 'No members available',
      goToConfig: 'Go to Config to add members'
    }
  }
}

// Get current language from localStorage or default to 'th'
export const getLanguage = () => {
  return localStorage.getItem('mvp-language') || 'th'
}

// Set language
export const setLanguage = (lang) => {
  localStorage.setItem('mvp-language', lang)
}

// Get translation
export const t = (key) => {
  const lang = getLanguage()
  const keys = key.split('.')
  let value = translations[lang]
  
  for (const k of keys) {
    value = value?.[k]
  }
  
  return value || key
}

export default translations

