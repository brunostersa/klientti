'use client';

import { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import { CardAction } from '@/components/Card';

interface QRCodeGeneratorProps {
  areaId: string;
  areaName: string;
  size?: number;
  userProfile?: {
    name?: string;
    company?: string;
    segment?: string;
    logoUrl?: string;
  } | null;
}

export default function QRCodeGenerator({ areaId, areaName, size = 120, userProfile }: QRCodeGeneratorProps) {
  const [feedbackUrl, setFeedbackUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const url = `${window.location.origin}/feedback/${areaId}`;
    setFeedbackUrl(url);
  }, [areaId]);

  const downloadQRCode = async () => {
    if (!qrRef.current) return;
    
    setIsLoading(true);
    setError('');
    setShowSuccess(false);
    
    try {
      const canvas = document.createElement('canvas');
      const svg = qrRef.current.querySelector('svg');
      if (!svg) return;

      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      
      img.onload = () => {
        canvas.width = size + 40;
        canvas.height = size + 40;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Fundo branco com borda sutil
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Borda sutil
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

        // Desenhar QR Code
        ctx.drawImage(img, 20, 20, size, size);

        // Download
        const link = document.createElement('a');
        link.download = `qrcode-${areaName}.png`;
        link.href = canvas.toDataURL();
        link.click();
        
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    } catch (error) {
      console.error('Erro ao baixar QR Code:', error);
      setError('Erro ao baixar QR Code. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPersonalizedPDF = async () => {
    setIsLoading(true);
    setError('');
    setShowSuccess(false);
    
    try {
      if (!qrRef.current || !feedbackUrl) {
        setError('QR Code não está disponível. Aguarde um momento e tente novamente.');
        return;
      }

      const svg = qrRef.current.querySelector('svg');
      if (!svg) {
        setError('QR Code não foi gerado. Tente novamente.');
        return;
      }

      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;

      // ===== CABEÇALHO CLEAN E PROFISSIONAL =====
      // Fundo branco limpo
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      // Logo da empresa (círculo minimalista) - centralizado
      const logoSize = 8;
      const logoY = 15;
      doc.setFillColor(37, 99, 235);
      doc.circle(pageWidth / 2, logoY + logoSize/2, logoSize/2, 'F');
      
      // Inicial da empresa
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(6);
      doc.setFont('helvetica', 'bold');
      const companyInitial = userProfile?.company?.charAt(0) || 'K';
      doc.text(companyInitial, pageWidth / 2, logoY + logoSize/2 + 0.5, { align: 'center' });

      // Nome da empresa - centralizado
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(userProfile?.company || 'Klientti', pageWidth / 2, logoY + logoSize + 8, { align: 'center' });

      // Título principal - Copy convidativo
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Avalie nossa qualidade', pageWidth / 2, 40, { align: 'center' });
      
      // Subtítulo - CTA claro
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text('Sua opinião nos ajuda a melhorar', pageWidth / 2, 47, { align: 'center' });

      // ===== QR CODE CENTRAL - DESIGN MINIMALISTA =====
      const qrSize = 78; // Aumentado em 30% (60 * 1.3)
      const qrX = (pageWidth - qrSize) / 2;
      const qrY = 60;

      // Fundo sutil do QR Code
      doc.setFillColor(248, 250, 252);
      doc.rect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20, 'F');
      
      // Borda sutil
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.5);
      doc.rect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);

      // Gerar QR Code como imagem
      try {
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const img = new Image();
        
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        img.src = url;
        
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('Timeout')), 2000);
          img.onload = () => {
            clearTimeout(timeout);
            URL.revokeObjectURL(url);
            resolve(null);
          };
          img.onerror = () => {
            clearTimeout(timeout);
            URL.revokeObjectURL(url);
            reject(new Error('Erro ao carregar imagem'));
          };
        });

        const scale = 4;
        canvas.width = qrSize * scale;
        canvas.height = qrSize * scale;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          const qrImageData = canvas.toDataURL('image/png', 1.0);
          doc.addImage(qrImageData, 'PNG', qrX, qrY, qrSize, qrSize);
        }
      } catch (imageError) {
        console.warn('Erro ao gerar QR code:', imageError);
        doc.setFillColor(240, 240, 240);
        doc.rect(qrX, qrY, qrSize, qrSize, 'F');
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(10);
        doc.text('QR Code', qrX + qrSize/2, qrY + qrSize/2, { align: 'center' });
      }

      // ===== SEÇÃO DE INSTRUÇÕES CLEAN =====
      const instructionsY = qrY + qrSize + 25;
      
      // Título das instruções - Copy convidativo
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Como avaliar:', pageWidth / 2, instructionsY, { align: 'center' });
      
      // Instruções simples e diretas
      const steps = [
        '1. Abra a câmera do seu celular',
        '2. Aponte para o código acima',
        '3. Toque na notificação',
        '4. Avalie em poucos segundos'
      ];
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      
      steps.forEach((step, index) => {
        const stepY = instructionsY + 8 + (index * 5);
        doc.text(step, pageWidth / 2, stepY, { align: 'center' });
      });

      // ===== CTA PRINCIPAL =====
      const ctaY = instructionsY + 35;
      doc.setTextColor(37, 99, 235);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('É rápido e anônimo!', pageWidth / 2, ctaY, { align: 'center' });
      
      // Benefício adicional
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Sua avaliação nos ajuda a oferecer um serviço ainda melhor', pageWidth / 2, ctaY + 6, { align: 'center' });

      // ===== RODAPÉ MINIMALISTA =====
      const footerY = pageHeight - 15;
      
      // Logo Klientti minimalista
      doc.setFillColor(37, 99, 235);
      doc.circle(pageWidth / 2, footerY, 2, 'F');
      doc.setTextColor(37, 99, 235);
      doc.setFontSize(6);
      doc.setFont('helvetica', 'bold');
      doc.text('K', pageWidth / 2, footerY + 0.5, { align: 'center' });
      
      // Texto do rodapé discreto
      doc.setTextColor(150, 150, 150);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.text('Criado com Klientti', pageWidth / 2, footerY + 5, { align: 'center' });
      
      doc.save(`feedback-${areaName}-${new Date().toISOString().split('T')[0]}.pdf`);
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      setError('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(feedbackUrl);
      setIsCopied(true);
      setShowSuccess(true);
      setTimeout(() => {
        setIsCopied(false);
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Erro ao copiar link:', error);
      setError('Erro ao copiar link. Tente novamente.');
    }
  };

  return (
    <div className="relative overflow-hidden group">
      {/* Success Message */}
      {showSuccess && (
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-theme-success text-theme-inverse px-2 py-1 rounded-full text-xs font-medium animate-fade-in">
            ✅ Sucesso!
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-3 p-2 bg-theme-error-light border border-theme-error rounded-lg animate-fade-in">
          <p className="text-theme-error text-xs">{error}</p>
        </div>
      )}

      {/* QR Code com design moderno */}
      <div className="flex justify-center mb-4">
        <div 
          ref={qrRef} 
          className="relative p-3 bg-white rounded-xl shadow-theme-sm border border-theme-primary group-hover:shadow-theme-md transition-all duration-300"
        >
          {feedbackUrl ? (
            <QRCodeSVG
              value={feedbackUrl}
              size={size}
              level="M"
              includeMargin={true}
              className="transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center" style={{ width: size, height: size }}>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-primary"></div>
            </div>
          )}
          
          {/* Overlay sutil no hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-brand-primary-light opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></div>
        </div>
      </div>

      {/* Botões de ação modernos */}
      <div className="flex flex-wrap gap-2 mb-4">
        <CardAction
          onClick={downloadQRCode}
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="flex items-center space-x-1 py-2 px-3 transition-all duration-200 hover:scale-105"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="font-medium text-xs">Baixar QRCODE</span>
        </CardAction>

        <CardAction
          onClick={downloadPersonalizedPDF}
          disabled={isLoading}
          variant="primary"
          size="sm"
          className="flex items-center space-x-1 py-2 px-3 transition-all duration-200 hover:scale-105 text-white"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="font-medium text-xs">Baixar PDF para imprimir</span>
        </CardAction>
      </div>

      {/* Botões secundários */}
      <div className="flex space-x-2 mb-4">
        <CardAction
          onClick={copyLink}
          disabled={isCopied}
          variant="outline"
          size="sm"
          className="flex-1 flex items-center justify-center space-x-2 py-2 transition-all duration-200 hover:scale-105"
        >
          {isCopied ? (
            <svg className="w-4 h-4 text-theme-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
          <span className="font-medium text-xs">
            {isCopied ? 'Copiado!' : 'Copiar Link'}
          </span>
        </CardAction>

        <CardAction
          onClick={() => window.open(feedbackUrl, '_blank')}
          disabled={!feedbackUrl}
          variant="outline"
          size="sm"
          className="flex items-center justify-center space-x-2 py-2 px-3 transition-all duration-200 hover:scale-105"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span className="font-medium text-xs">Abrir</span>
        </CardAction>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-primary mx-auto mb-2"></div>
            <p className="text-theme-secondary text-xs">Processando...</p>
          </div>
        </div>
      )}
    </div>
  );
}
