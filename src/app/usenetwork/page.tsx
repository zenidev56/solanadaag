'use client'

import Navbar from '@/components/Navbar'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react';
import { Avatar, Name } from '@coinbase/onchainkit/identity';
import { 
  Transaction, 
  TransactionButton,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from '@coinbase/onchainkit/transaction'; 
import type { LifecycleStatus } from '@coinbase/onchainkit/transaction';
import { Wallet, ConnectWallet } from '@coinbase/onchainkit/wallet';
import { useAccount } from 'wagmi';
import type {
  TransactionError,
  TransactionResponse,
} from '@coinbase/onchainkit/transaction';

import { BASE_SEPOLIA_CHAIN_ID,
  BasedPayAddress,
  SampleUsdtAbi,
  SampleUsdtAddress,}from "../../constants/constants"
  import type { Address, ContractFunctionParameters } from 'viem';
export default function Use() {
  const [qrCode, setQrCode] = useState('')
  const [code, setCode] = useState('')
  const [duration, setDuration] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [isMobileConnected, setIsMobileConnected] = useState(false)
  const router = useRouter()


  const { address } = useAccount();
  
  const handleOnStatus = useCallback((status: LifecycleStatus) => {
    console.log('LifecycleStatus', status);
  }, []);




  const contracts = [
    {
      address: SampleUsdtAddress,
      abi: SampleUsdtAbi,
      functionName: 'approve',
      args: [BasedPayAddress,100000],
    },
  ] as unknown as ContractFunctionParameters[];

  const handleError = (err: TransactionError) => {
    console.error('Transaction error:', err);
  };

  const handleSuccess = (response: TransactionResponse) => {
    console.log('Transaction successful', response);
  };

  useEffect(() => {
    // Check if a mobile device is connected via USB
    // This is a placeholder function and would need to be implemented
    // based on the specific requirements of your system
    const checkMobileConnection = async () => {
      try {
        // Placeholder for actual USB connection check
        const connected = await navigator.usb.getDevices()
        setIsMobileConnected(connected.length > 0)
      } catch (error) {
        console.error('Error checking USB connection:', error)
        setIsMobileConnected(false)
      }
    }

    checkMobileConnection()
  }, [])

  const handleScanQR = async () => {
    if (!isMobileConnected) {
      alert('Please connect a mobile device via USB to scan QR code')
      return
    }

    setIsScanning(true)
    try {
      // Placeholder for actual QR scanning logic
      // This would need to be implemented based on your specific requirements
      const scannedCode = await new Promise(resolve => setTimeout(() => resolve('SCANNED_QR_CODE'), 2000))
      setQrCode(scannedCode)
      setCode(scannedCode)
    } catch (error) {
      console.error('Error scanning QR code:', error)
      alert('Failed to scan QR code. Please try again.')
    } finally {
      setIsScanning(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Submitted:', { code, duration })
    
    router.push('/discount') 
  }

  return (
    <div className='bg-gray-900'>
        
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4">
      <div className="w-full -mt-12 max-w-md">
        <h2 className="text-5xl font-bold text-white mb-6 text-center">QR Code Scanner</h2>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <button
            onClick={handleScanQR}
            disabled={isScanning}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 mb-4"
          >
            {isScanning ? 'Scanning...' : 'SCAN QR'}
          </button>
          
          {qrCode && (
            <p className="text-green-400 text-center">QR Code scanned: {qrCode}</p>
          )}
        </div>

        <div className="text-white text-center mb-4">or</div>

        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-2">
              ENTER CODE
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3 py-2 text-gray-300 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter code"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-2">
              Duration
            </label>
            <input
              type="text"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3 py-2 text-gray-300 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter duration"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
    </div>
  )
}