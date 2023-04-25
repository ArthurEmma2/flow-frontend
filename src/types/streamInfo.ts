

interface StreamInfo {
    coinId: string, // coinObject
    streamId: string, // streamId
    senderId: string, // sender's address
    recipientId: string, // recipient's address
    name: string, // stream's name
    ratePerSecond: string,
    startTime: string, // stream's start time
    stopTime: string,  // stream's end time
    lastWithdrawTime: string, // stream's last withdraw time
    depositAmount: string, // stream's total deposit amount
    remainingBalance: string, // stream's remaining balance
    streamedAmount: string, // stream's transferred amount
    toTransfer: string, // stream's untransferred amount
    interval: string, // stream's interval
    status: string, // stream's current status
    toBeWithdrawal: string, // 收款方 当前可以 接收的金额
    withdrawn: string, // 已经接收的金额
    // prev_withdrawn?: string,
    // prev_streamed_amount?: string,
    // prev_remaining_balance?: string,
}

export default StreamInfo;