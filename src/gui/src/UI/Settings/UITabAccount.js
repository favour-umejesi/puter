/**
 * Copyright (C) 2024 Puter Technologies Inc.
 *
 * This file is part of Puter.
 *
 * Puter is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import UIWindowChangePassword from '../UIWindowChangePassword.js';
import UIWindowChangeEmail from './UIWindowChangeEmail.js';
import UIWindowChangeUsername from '../UIWindowChangeUsername.js';
import UIWindowConfirmUserDeletion from './UIWindowConfirmUserDeletion.js';
import UIWindowManageSessions from '../UIWindowManageSessions.js';
import UIWindow from '../UIWindow.js';
import UINotification from '../UINotification.js';
import UIAlert from '../UIAlert.js';

// About
export default {
    id: 'account',
    title_i18n_key: 'account',
    icon: 'user.svg',
    html: () => {
        let h = '';
        // h += `<h1>${i18n('account')}</h1>`;

        // profile picture
        h += `<div style="overflow: hidden; display: flex; margin-bottom: 20px; flex-direction: column; align-items: center;">`;
            h += `<div class="profile-picture change-profile-picture" style="background-image: url('${html_encode(window.user?.profile?.picture ?? window.icons['profile.svg'])}');">`;
            h += `</div>`;
            // Remove profile picture button (only show if picture exists)
            if(window.user?.profile?.picture){
                h += `<button class="button remove-profile-picture" style="margin-top: 10px;">${i18n('remove_profile_picture')}</button>`;
            }
        h += `</div>`;

        // change password button
        if(!window.user.is_temp){
            h += `<div class="settings-card">`;
                h += `<strong>${i18n('password')}</strong>`;
                h += `<div style="flex-grow:1;">`;
                    h += `<button class="button change-password" style="float:right;">${i18n('change_password')}</button>`;
                h += `</div>`;
            h += `</div>`;
        }

        // change username button
        h += `<div class="settings-card">`;
            h += `<div>`;
                h += `<strong style="display:block;">${i18n('username')}</strong>`;
                h += `<span class="username" style="display:block; margin-top:5px;">${html_encode(window.user.username)}</span>`;
            h += `</div>`;
            h += `<div style="flex-grow:1;">`;
                h += `<button class="button change-username" style="float:right;">${i18n('change_username')}</button>`;
            h += `</div>`
        h += `</div>`;

        // change email button
        if(window.user.email){
            h += `<div class="settings-card">`;
                h += `<div>`;
                    h += `<strong style="display:block;">${i18n('email')}</strong>`;
                    h += `<span class="user-email" style="display:block; margin-top:5px;">${html_encode(window.user.email)}</span>`;
                h += `</div>`;
                h += `<div style="flex-grow:1;">`;
                    h += `<button class="button change-email" style="float:right;">${i18n('change_email')}</button>`;
                h += `</div>`;
            h += `</div>`;
        }

        // 'Delete Account' button
        h += `<div class="settings-card settings-card-danger">`;
            h += `<strong style="display: inline-block;">${i18n("delete_account")}</strong>`;
            h += `<div style="flex-grow:1;">`;
                h += `<button class="button button-danger delete-account" style="float:right;">${i18n("delete_account")}</button>`;
            h += `</div>`;
        h += `</div>`;

        return h;
    },
    init: ($el_window) => {
        $el_window.find('.change-password').on('click', function (e) {
            UIWindowChangePassword({
                window_options:{
                    parent_uuid: $el_window.attr('data-element_uuid'),
                    disable_parent_window: true,
                    parent_center: true,
                }
            });
        });

        $el_window.find('.change-username').on('click', function (e) {
            UIWindowChangeUsername({
                window_options:{
                    parent_uuid: $el_window.attr('data-element_uuid'),
                    disable_parent_window: true,
                    parent_center: true,
                }
            });
        });

        $el_window.find('.change-email').on('click', function (e) {
            UIWindowChangeEmail({
                window_options:{
                    parent_uuid: $el_window.attr('data-element_uuid'),
                    disable_parent_window: true,
                    parent_center: true,
                }
            });
        });

        $el_window.find('.manage-sessions').on('click', function (e) {
            UIWindowManageSessions({
                window_options:{
                    parent_uuid: $el_window.attr('data-element_uuid'),
                    disable_parent_window: true,
                    parent_center: true,
                }
            });
        });

        $el_window.find('.delete-account').on('click', function (e) {
            UIWindowConfirmUserDeletion({
                window_options:{
                    parent_uuid: $el_window.attr('data-element_uuid'),
                    disable_parent_window: true,
                    parent_center: true,
                }
            });
        });

        $el_window.find('.change-profile-picture').on('click', async function (e) {
            // open dialog
            UIWindow({
                path: '/' + window.user.username + '/Desktop',
                // this is the uuid of the window to which this dialog will return
                parent_uuid: $el_window.attr('data-element_uuid'),
                allowed_file_types: ['.png', '.jpg', '.jpeg'],
                show_maximize_button: false,
                show_minimize_button: false,
                title: 'Open',
                is_dir: true,
                is_openFileDialog: true,
                selectable_body: false,
            });    
        })

        $el_window.find('.remove-profile-picture').on('click', async function (e) {
            try {
                // Remove profile picture
                await update_profile(window.user.username, {picture: null});
                
                // Update UI using helper function
                window.update_profile_picture_ui(null);
                $el_window.find('.profile-picture').css('background-image', 'url(' + html_encode(window.icons['profile.svg']) + ')');
                
                // Hide the remove button
                $el_window.find('.remove-profile-picture').hide();
                
                // Show success alert
                await UIAlert({
                    type: 'success',
                    message: i18n('profile_picture_removed_successfully')
                });
            } catch (error) {
                console.error('Error removing profile picture:', error);
                await UIAlert({
                    type: 'error',
                    message: i18n('profile_picture_remove_failed') + (error?.message ? ': ' + error.message : '')
                });
            }
        })

        $el_window.on('file_opened', async function(e){
            let selected_file = Array.isArray(e.detail) ? e.detail[0] : e.detail;
            
            // Disable upload button and show loading state
            const $changeBtn = $el_window.find('.change-profile-picture');
            const $removeBtn = $el_window.find('.remove-profile-picture');
            const originalChangeBtnOpacity = $changeBtn.css('opacity');
            $changeBtn.css('opacity', '0.5').css('pointer-events', 'none');
            if ($removeBtn.length) {
                $removeBtn.css('opacity', '0.5').css('pointer-events', 'none');
            }
            
            try {
                // Enhanced validation: check file extension
                const fileName = selected_file.name || selected_file.fsentry_name || selected_file.path?.split('/').pop() || '';
                const fileExtension = fileName.toLowerCase().split('.').pop();
                const allowedExtensions = ['png', 'jpg', 'jpeg'];
                
                // Reject if we have a filename with extension AND it's clearly invalid
                if (fileName && fileExtension && fileName.includes('.')) {
                    if (!allowedExtensions.includes(fileExtension)) {
                        await UIAlert({
                            type: 'error',
                            message: i18n('profile_picture_invalid_file')
                        });
                        // Re-enable buttons
                        $changeBtn.css('opacity', originalChangeBtnOpacity).css('pointer-events', 'auto');
                        if ($removeBtn.length) {
                            $removeBtn.css('opacity', '1').css('pointer-events', 'auto');
                        }
                        return;
                    }
                }

                // Read the file
                const profile_pic = await puter.fs.read(selected_file.path);
                
                // Validate file size (max 10MB for profile pictures)
                const maxSize = 10 * 1024 * 1024; // 10MB
                if (profile_pic.size && profile_pic.size > maxSize) {
                    await UIAlert({
                        type: 'error',
                        message: i18n('profile_picture_too_large')
                    });
                    // Re-enable buttons
                    $changeBtn.css('opacity', originalChangeBtnOpacity).css('pointer-events', 'auto');
                    if ($removeBtn.length) {
                        $removeBtn.css('opacity', '1').css('pointer-events', 'auto');
                    }
                    return;
                }

                // blob to base64
                const reader = new FileReader();
                
                reader.onerror = async function() {
                    await UIAlert({
                        type: 'error',
                        message: i18n('profile_picture_upload_failed')
                    });
                };

                reader.onloadend = async function() {
                    try {
                        // Validate that we got a data URL
                        if (!reader.result || typeof reader.result !== 'string' || !reader.result.startsWith('data:')) {
                            throw new Error('Invalid file data');
                        }
                        
                        // Enhanced MIME type validation
                        const mimeType = reader.result.split(';')[0].split(':')[1];
                        const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
                        if (!allowedMimeTypes.includes(mimeType)) {
                            await UIAlert({
                                type: 'error',
                                message: i18n('profile_picture_invalid_file')
                            });
                            // Re-enable buttons
                            $changeBtn.css('opacity', originalChangeBtnOpacity).css('pointer-events', 'auto');
                            if ($removeBtn.length) {
                                $removeBtn.css('opacity', '1').css('pointer-events', 'auto');
                            }
                            return;
                        }

                        // Load and resize image with aspect ratio preservation
                        const img = new Image();
                        
                        img.onerror = async function() {
                            await UIAlert({
                                type: 'error',
                                message: i18n('profile_picture_load_failed')
                            });
                            // Re-enable buttons
                            $changeBtn.css('opacity', originalChangeBtnOpacity).css('pointer-events', 'auto');
                            if ($removeBtn.length) {
                                $removeBtn.css('opacity', '1').css('pointer-events', 'auto');
                            }
                        };

                        img.onload = async function() {
                            try {
                                const canvas = document.createElement('canvas');
                                const ctx = canvas.getContext('2d');
                                
                                if (!ctx) {
                                    throw new Error('Canvas context not available');
                                }
                                
                                // Resize image maintaining aspect ratio (max 150x150)
                                const maxSize = 150;
                                let width = img.width;
                                let height = img.height;
                                
                                // Calculate dimensions maintaining aspect ratio
                                if (width > height) {
                                    if (width > maxSize) {
                                        height = (height / width) * maxSize;
                                        width = maxSize;
                                    }
                                } else {
                                    if (height > maxSize) {
                                        width = (width / height) * maxSize;
                                        height = maxSize;
                                    }
                                }
                                
                                canvas.width = maxSize;
                                canvas.height = maxSize;
                                
                                // Clear canvas (important for transparent images)
                                ctx.clearRect(0, 0, maxSize, maxSize);
                                
                                // Center the image on canvas
                                const x = (maxSize - width) / 2;
                                const y = (maxSize - height) / 2;
                                ctx.drawImage(img, x, y, width, height);
                                
                                const base64data = canvas.toDataURL('image/png');
                                
                                if (!base64data || !base64data.startsWith('data:image')) {
                                    throw new Error('Failed to convert image to base64');
                                }
                                
                                // Update profile picture using helper function
                                window.update_profile_picture_ui(base64data);
                                $el_window.find('.profile-picture').css('background-image', 'url(' + html_encode(base64data) + ')');
                                
                                // Update profile picture in storage
                                await update_profile(window.user.username, {picture: base64data});
                                
                                // Show or create the remove button
                                let $removeBtnElement = $el_window.find('.remove-profile-picture');
                                if($removeBtnElement.length === 0){
                                    // Create the button if it doesn't exist
                                    $removeBtnElement = $(`<button class="button remove-profile-picture" style="margin-top: 10px;">${i18n('remove_profile_picture')}</button>`);
                                    $el_window.find('.profile-picture').parent().append($removeBtnElement);
                                    // Add click handler for the newly created button
                                    $removeBtnElement.on('click', async function (e) {
                                        try {
                                            // Remove profile picture
                                            await update_profile(window.user.username, {picture: null});
                                            
                                            // Update UI using helper function
                                            window.update_profile_picture_ui(null);
                                            $el_window.find('.profile-picture').css('background-image', 'url(' + html_encode(window.icons['profile.svg']) + ')');
                                            
                                            // Hide the remove button
                                            $removeBtnElement.hide();
                                            
                                            // Show success alert
                                            await UIAlert({
                                                type: 'success',
                                                message: i18n('profile_picture_removed_successfully')
                                            });
                                        } catch (error) {
                                            console.error('Error removing profile picture:', error);
                                            await UIAlert({
                                                type: 'error',
                                                message: i18n('profile_picture_remove_failed') + (error?.message ? ': ' + error.message : '')
                                            });
                                        }
                                    });
                                } else {
                                    $removeBtnElement.show();
                                }
                                
                                // Re-enable buttons
                                $changeBtn.css('opacity', originalChangeBtnOpacity).css('pointer-events', 'auto');
                                $removeBtnElement.css('opacity', '1').css('pointer-events', 'auto');
                                
                                // Show success alert
                                await UIAlert({
                                    type: 'success',
                                    message: i18n('profile_picture_uploaded_successfully')
                                });
                            } catch (error) {
                                console.error('Error processing image:', error);
                                await UIAlert({
                                    type: 'error',
                                    message: i18n('profile_picture_update_failed') + (error?.message ? ': ' + error.message : '')
                                });
                                // Re-enable buttons
                                $changeBtn.css('opacity', originalChangeBtnOpacity).css('pointer-events', 'auto');
                                if ($removeBtn.length) {
                                    $removeBtn.css('opacity', '1').css('pointer-events', 'auto');
                                }
                            }
                        };
                        
                        img.src = reader.result;
                    } catch (error) {
                        console.error('Error reading file:', error);
                        await UIAlert({
                            type: 'error',
                            message: i18n('profile_picture_upload_failed') + (error?.message ? ': ' + error.message : '')
                        });
                        // Re-enable buttons
                        $changeBtn.css('opacity', originalChangeBtnOpacity).css('pointer-events', 'auto');
                        if ($removeBtn.length) {
                            $removeBtn.css('opacity', '1').css('pointer-events', 'auto');
                        }
                    }
                };

                reader.readAsDataURL(profile_pic);
            } catch (error) {
                console.error('Error reading profile picture file:', error);
                await UIAlert({
                    type: 'error',
                    message: i18n('profile_picture_upload_failed') + (error?.message ? ': ' + error.message : '')
                });
                // Re-enable buttons
                $changeBtn.css('opacity', originalChangeBtnOpacity).css('pointer-events', 'auto');
                if ($removeBtn.length) {
                    $removeBtn.css('opacity', '1').css('pointer-events', 'auto');
                }
            }
        })
    },
};
