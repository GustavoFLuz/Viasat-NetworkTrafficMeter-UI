!include nsDialogs.nsh

XPStyle on

Var Dialog
Var UserLabel
Var Link
Var Checkbox

Page custom myCustomPage myCustomPageLeave

Function myCustomPage

    nsDialogs::Create 1018
    Pop $Dialog

    ${If} $Dialog == error
        Abort
    ${EndIf}

    ${NSD_CreateLabel} 0 0 100% 24u "Viasat's Network Traffic Metter relies on NPCAP to be able to gather network usage data from your computer. Please click the link below to download and install:"
    Pop $UserLabel

    ${NSD_CreateLink} 0 25u 100% 12u "Download NPCAP"
    Pop $Link
    ${NSD_OnClick} $Link onClickMyLink 

    ${NSD_CreateCheckbox} 0 120u 100% 12u "I have installed NPCAP"
    Pop $Checkbox

    nsDialogs::Show

FunctionEnd

Function myCustomPageLeave
    ${NSD_GetState} $Checkbox $0
    ${If} $0 == ${BST_CHECKED}
        ; Continue with the desired code
    ${Else}
        MessageBox MB_OK "Please confirm that you have installed NPCAP."
        Abort
    ${EndIf}
    
FunctionEnd

Function onClickMyLink
    Pop $0
    ExecShell "open" "https://npcap.com/#download"
FunctionEnd

Section
SectionEnd