export enum ErrorMessage {
  ACCESS_DENIED = 'ปฏิเสธการเข้าถึง',
  CONTACT_SERIVCE = 'เกิดข้อผิดพลาด กรุณาติดต่อเจ้าหน้าที่',
  UNAUTHORIZED = 'ไม่ได้รับอนุญาตในการใช้งาน',
  USER_LOCKED = 'ผู้ใช้งานถูกล็อคชั่วคราว กรุณาติดต่อเจ้าหน้าที่',
  USER_NOT_FOUND = 'ไม่พบผู้ใช้นี้',
  INCORRECT_PASSWORD = 'รหัสผ่านไม่ถูกต้อง',

  PIN_NOT_MATCH = 'คุณกรอกผิดจำนวน',
  PIN_NOT_MATCH_OVER_THREE = 'เนื่องจากใส่รหัสไม่ถูกต้องครบจำนวนครั้ง \nโปรดตั้งรหัสผ่านใหม่',

  INVALID_OTP = 'รหัส OTP ไม่ถูกต้อง',
  OTP_EXPIRED = 'รหัส OTP หมดอายุ',
  OTP_VERIFIED = 'รหัส OTP ถูกใช้งานแล้ว',
  OTP_SEND_FAILED = 'ไม่สามารถส่งรหัส OTP ได้',

  CONTRACT_NOT_FOUND = 'ไม่พบข้อมูลสัญญา',
  CONTRACT_NOT_MATCH_WITH_ID_CARD_NO = 'ไม่พบข้อมูลสัญญาที่ตรงกับหมายเลขบัตรประชาชน',

  CUSTOMER_NOT_FOUND = 'ไม่พบข้อมูลลูกค้า',

  INVALID_OBJECT_ID = 'ObjectId ไม่ถูกต้อง',
  CONSENT_NOT_EXISTS = 'ไม่พบข้อมูลคำยินยอม',
  CONSENT_NO_LONGER_ACTIVE = 'ข้อมูลคำยินยอมนี้ถูกยกเลิกใช้งานแล้ว',

  SAVE_FAILED = 'บันทึกข้อมูลไม่สำเร็จ',

  LOAN_OFFERS_LESS_THAN_450 = 'ค่างวดน้อยกว่า 450 บาท',
  DESIRED_LOAN_AMOUT_LESS_THAN_3000 = 'วงเงินที่ต้องการกู้น้อยกว่า 3000 บาท',
  MISMATCH_PHONE_NUMBER = 'หมายเลขโทรศัพท์ไม่ตรงกับข้อมูลสัญญาหรือผู้ใช้งาน'
}
