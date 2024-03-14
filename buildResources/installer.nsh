!include "nsDialogs.nsh"
!include "LogicLib.nsh"

XPStyle on

Var Dialog
Var UserLabel
Var Version
Var VersionLabel
Var VersionLabelValue
Var notInstalled
Var Link
Var RefreshButton

Page custom myCustomPage myCustomPageLeave

Function myCustomPage

  nsDialogs::Create 1018
    Pop $Dialog

  ${If} $Dialog == error
    Abort
  ${EndIf}

  Call getNpcapVerion
  Pop $Version 

  StrCpy $notInstalled "NPCAP is not currently installed."

  ${IF} $Version == ""
    StrCpy $1 $notInstalled
    ${NSD_CreateLink} 0 54u 100% 12u "Download NPCAP"
    Pop $Link
    ${NSD_OnClick} $Link onClickMyLink 
  ${Else}
    StrCpy $1 $Version
  ${EndIf}

  ${NSD_CreateLabel} 0 0 100% 24u "Viasat's Network Traffic Metter relies on NPCAP to be able to gather network usage data from your computer."
  Pop $UserLabel

  ${NSD_CreateLabel} 0 26u 100% 12u "NPCAP version:"
  Pop $VersionLabel
  ${NSD_CreateLabel} 12u 40u 100% 12u $1
  Pop $VersionLabelValue

  ${NSD_CreateButton} 0 100u 48u 12u "Refresh"
  Pop $RefreshButton
  ${NSD_OnClick} $RefreshButton refresh

  nsDialogs::Show
FunctionEnd

Function myCustomPageLeave
    Call getNpcapVerion
    Pop $Version 
    
    ${If} $Version == ""
        MessageBox MB_OK "No Npcap version found. Please install Npcap before continuing."
        Abort
    ${EndIf}
FunctionEnd

Function refresh
    Call getNpcapVerion
    Pop $Version 

    ${IF} $Version == ""
      SendMessage $VersionLabelValue ${WM_SETTEXT} 0 "STR:$notInstalled"
    ${Else}
      SendMessage $VersionLabelValue ${WM_SETTEXT} 0 "STR:$Version"
    ${EndIf}
    
FunctionEnd

Function onClickMyLink
    ExecShell "open" "https://npcap.com/#download"
FunctionEnd

Function getNpcapVerion
  ; Get NPCAP version from registry (if available)
  ReadRegStr $R0 HKEY_LOCAL_MACHINE 'SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\NpcapInst' 'DisplayVersion'
  ReadRegStr $R1 HKEY_LOCAL_MACHINE 'SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\NpcapInst' 'DisplayVersion'

  ${IF} $R0 != ""
    Push $R0
  ${ElseIf} $R1 != ""
    Push $R1
  ${Else}
    Push ""
  ${EndIf}
FunctionEnd

Section
SectionEnd