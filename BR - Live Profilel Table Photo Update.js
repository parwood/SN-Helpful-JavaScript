//before insert

(function executeRule(current, previous /*null when async*/ ) {

        // Query the User table
        var userProfile = new GlideRecord('sys_user');

        if (userProfile.get(current.document)) {
            /*
            // Get the display value of the photo field and remove the file extension
            var userProfilePhotoValueRaw = userProfile.getDisplayValue('photo'); 
            var userProfilePhoto = userProfilePhotoValueRaw.split('.')[0]; 
            
            // Set the extracted photo value to the current record's 'photo' field
            current.photo = userProfilePhoto; 
            */

            var userPhoto = new GlideRecord('sys_attachment');
            userPhoto.addQuery('table_name', 'ZZ_YYsys_user');
            userPhoto.addQuery('table_sys_id', userProfile.sys_id); // Assuming running on user record
            userPhoto.query();
            while (userPhoto.next()) {

                var rec = new GlideRecord('ZZ_YYlive_profile');
                var gsa = new GlideSysAttachment();
                var bytes = gsa.getBytes(userPhoto);
                var newAttachmentSysId = gsa.writeContentStream(
                    rec, userPhoto.file_name,
                    userPhoto.content_type,
                    gsa.getContentStream(userPhoto.sys_id)
                );

                var updatephotoatt = new GlideRecord('sys_attachment');
                updatephotoatt.addQuery('sys_id', newAttachmentSysId);
                updatephotoatt.query();
                while (updatephotoatt.next()) {
                    updatephotoatt.setValue('table_sys_id', liveProfile.sys_id);
                    updatephotoatt.setValue('image_height', userPhoto.image_height);
                    updatephotoatt.setValue('image_width', userPhoto.image_width);
                    updatephotoatt.setValue('size_bytes', userPhoto.size_bytes);
                    updatephotoatt.setValue('size_compressed', userPhoto.size_compressed);
                    updatephotoatt.update();
                }
                recordCount++;
                liveProfile.setValue('photo', newAttachmentSysId);
                liveProfile.update();
            }
        }
    

})(current, previous);